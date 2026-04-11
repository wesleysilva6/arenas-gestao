const WA_BASE = import.meta.env.VITE_WA_BASE_URL || 'http://localhost:3001'

export type WaStatus = 'disconnected' | 'qr' | 'connecting' | 'connected'

export interface WaEvent {
  type: 'qr' | 'status'
  qr?: string
  status?: WaStatus
  number?: string | null
}

export interface WaStatusResponse {
  status: WaStatus
  number: string | null
}

/** Abre um EventSource (SSE) para receber QR e status em tempo real */
export function subscribeWaEvents(onEvent: (ev: WaEvent) => void): () => void {
  const es = new EventSource(`${WA_BASE}/events`)

  es.onmessage = (e) => {
    try {
      const data: WaEvent = JSON.parse(e.data)
      onEvent(data)
    } catch { /* ignore */ }
  }

  es.onerror = () => {
    onEvent({ type: 'status', status: 'disconnected' })
  }

  return () => es.close()
}

/** Busca o status atual (fallback sem SSE) */
export async function getWaStatus(): Promise<WaStatusResponse> {
  const res = await fetch(`${WA_BASE}/status`)
  return res.json()
}

/** Solicita nova conexão (gera QR) */
export async function connectWa(): Promise<void> {
  await fetch(`${WA_BASE}/connect`, { method: 'POST' })
}

/** Desconecta e apaga a sessão */
export async function disconnectWa(): Promise<void> {
  await fetch(`${WA_BASE}/disconnect`, { method: 'POST' })
}

/** Envia uma mensagem individual */
export async function sendWaMessage(phone: string, message: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${WA_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message }),
  })
  return res.json()
}

/** Envia mensagens em lote (com delay automático entre cada) */
export async function sendWaBulk(
  contacts: string[],
  message: string,
): Promise<{ total: number; sent: number; results: { phone: string; ok: boolean; error?: string }[] }> {
  const res = await fetch(`${WA_BASE}/send-bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contacts, message }),
  })
  return res.json()
}
