const express = require('express')
const cors = require('cors')
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestWaWebVersion,
} = require('@whiskeysockets/baileys')
const QRCode = require('qrcode')
const pino = require('pino')
const path = require('path')
const fs = require('fs')

const PORT = process.env.WA_PORT || 3001
const AUTH_DIR = path.join(__dirname, 'auth_info')

// ── State ──
let sock = null
let qrDataUrl = null
let connectionStatus = 'disconnected' // disconnected | qr | connecting | connected
let connectedNumber = null
const sseClients = new Set()

// ── SSE broadcast ──
function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`
  for (const client of sseClients) {
    client.write(payload)
  }
}

// ── WhatsApp connection ──
async function connectWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

  const { version } = await fetchLatestWaWebVersion()
  console.log(`Usando WhatsApp Web versão: ${version.join('.')}`)

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '120.0.5481.177'],
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    retryRequestDelayMs: 500,
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      qrDataUrl = await QRCode.toDataURL(qr, { width: 280, margin: 2 })
      connectionStatus = 'qr'
      broadcast({ type: 'qr', qr: qrDataUrl })
    }

    if (connection === 'connecting') {
      connectionStatus = 'connecting'
      broadcast({ type: 'status', status: 'connecting' })
    }

    if (connection === 'open') {
      connectionStatus = 'connected'
      qrDataUrl = null
      connectedNumber = sock.user?.id?.split(':')[0] || null
      console.log(`WhatsApp conectado: ${connectedNumber}`)
      broadcast({ type: 'status', status: 'connected', number: connectedNumber })
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const errorMessage = lastDisconnect?.error?.message || 'sem detalhes'
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut
      connectionStatus = 'disconnected'
      qrDataUrl = null
      connectedNumber = null
      broadcast({ type: 'status', status: 'disconnected' })

      console.log(`Conexão encerrada. StatusCode: ${statusCode} | Erro: ${errorMessage}`)

      if (shouldReconnect) {
        console.log('Reconectando WhatsApp...')
        setTimeout(connectWhatsApp, 3000)
      } else {
        console.log('WhatsApp deslogado. Limpando sessão...')
        cleanAuth()
      }
    }
  })
}

function cleanAuth() {
  if (fs.existsSync(AUTH_DIR)) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true })
  }
}

function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '')

  // Remove prefixes de discagem comuns como 00/0 antes do DDI/DDD.
  digits = digits.replace(/^00/, '')

  if (digits.startsWith('55')) {
    digits = `55${digits.slice(2).replace(/^0+/, '')}`
  } else {
    digits = `55${digits.replace(/^0+/, '')}`
  }

  if (digits.length < 12 || digits.length > 13) {
    throw new Error(`Telefone invalido para WhatsApp: ${phone}`)
  }

  return digits
}

async function resolveWhatsAppJid(phone) {
  const normalizedPhone = normalizePhone(phone)
  const phoneJid = `${normalizedPhone}@s.whatsapp.net`

  if (!sock?.onWhatsApp) {
    return { normalizedPhone, jid: phoneJid }
  }

  const [result] = await sock.onWhatsApp(phoneJid)

  if (result?.exists && result?.jid) {
    return { normalizedPhone, jid: result.jid }
  }

  throw new Error(`Numero nao encontrado no WhatsApp: ${normalizedPhone}`)
}

// ── Express ──
const app = express()
app.use(cors())
app.use(express.json())

// SSE — real-time updates
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  sseClients.add(res)

  // Send current state immediately
  if (connectionStatus === 'qr' && qrDataUrl) {
    res.write(`data: ${JSON.stringify({ type: 'qr', qr: qrDataUrl })}\n\n`)
  } else {
    res.write(`data: ${JSON.stringify({ type: 'status', status: connectionStatus, number: connectedNumber })}\n\n`)
  }

  req.on('close', () => sseClients.delete(res))
})

// Status
app.get('/status', (_req, res) => {
  res.json({ status: connectionStatus, number: connectedNumber })
})

// Send message
app.post('/send', async (req, res) => {
  const { phone, message } = req.body

  if (!phone || !message) {
    return res.status(400).json({ error: 'phone e message são obrigatórios' })
  }

  if (!sock || connectionStatus !== 'connected') {
    return res.status(503).json({ error: 'WhatsApp não conectado' })
  }

  try {
    const { jid, normalizedPhone } = await resolveWhatsAppJid(phone)
    await sock.sendMessage(jid, { text: message })
    res.json({ ok: true, to: jid, phone: normalizedPhone })
  } catch (err) {
    console.error('Erro ao enviar:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Send bulk
app.post('/send-bulk', async (req, res) => {
  const { contacts, message } = req.body

  if (!contacts?.length || !message) {
    return res.status(400).json({ error: 'contacts[] e message são obrigatórios' })
  }

  if (!sock || connectionStatus !== 'connected') {
    return res.status(503).json({ error: 'WhatsApp não conectado' })
  }

  const results = []
  for (const phone of contacts) {
    try {
      const { jid, normalizedPhone } = await resolveWhatsAppJid(phone)
      await sock.sendMessage(jid, { text: message })
      results.push({ phone: normalizedPhone, jid, ok: true })
      // delay between messages to avoid spam detection
      await new Promise((r) => setTimeout(r, 1500))
    } catch (err) {
      results.push({ phone, ok: false, error: err.message })
    }
  }

  res.json({ total: results.length, sent: results.filter((r) => r.ok).length, results })
})

// Connect (if disconnected)
app.post('/connect', async (_req, res) => {
  if (connectionStatus === 'connected') {
    return res.json({ status: 'already_connected', number: connectedNumber })
  }
  try {
    await connectWhatsApp()
    res.json({ status: 'connecting' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Disconnect / logout
app.post('/disconnect', async (_req, res) => {
  try {
    if (sock) {
      await sock.logout()
      sock = null
    }
    connectionStatus = 'disconnected'
    qrDataUrl = null
    connectedNumber = null
    cleanAuth()
    broadcast({ type: 'status', status: 'disconnected' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Start ──
app.listen(PORT, () => {
  console.log(`WhatsApp Service rodando na porta ${PORT}`)
  connectWhatsApp()
})
