import { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiMessageSquare } from 'react-icons/fi'
import {
  carregarDadosMensagens,
  cadastrarGrupo,
  editarGrupo,
  deletarGrupo,
  registrarMensagem,
  openWhatsApp,
  openGrupoLink,
  normalizeTelefone,
  type AlunoMsg,
  type TurmaMsg,
  type ModalidadeMsg,
  type AlunoTurmaMap,
  type GrupoWhatsApp,
  type MensagemLog,
} from '../../service/mensagens'
import {
  subscribeWaEvents,
  connectWa,
  disconnectWa,
  sendWaMessage,
  sendWaBulk,
  type WaStatus,
} from '../../service/whatsapp'
import type { TipoEnvio } from './components/templates'
import ComporMensagem from './components/ComporMensagem'
import ConexaoWhatsApp from './components/ConexaoWhatsApp'
import GruposWhatsApp from './components/GruposWhatsApp'
import HistoricoEnvios from './components/HistoricoEnvios'
import ModalGrupo, { type GrupoFormData } from './components/ModalGrupo'

export default function MensagensPage() {
  const toast = useToast()

  // ── Dados ──
  const [alunos, setAlunos] = useState<AlunoMsg[]>([])
  const [turmas, setTurmas] = useState<TurmaMsg[]>([])
  const [modalidades, setModalidades] = useState<ModalidadeMsg[]>([])
  const [alunosTurmaMap, setAlunosTurmaMap] = useState<AlunoTurmaMap[]>([])
  const [grupos, setGrupos] = useState<GrupoWhatsApp[]>([])
  const [historico, setHistorico] = useState<MensagemLog[]>([])
  const [sending, setSending] = useState(false)

  // ── Compor mensagem ──
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>('aluno')
  const [selectedAlunoId, setSelectedAlunoId] = useState('')
  const [selectedTurmaId, setSelectedTurmaId] = useState('')
  const [selectedModalidadeId, setSelectedModalidadeId] = useState('')
  const [selectedGrupoId, setSelectedGrupoId] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [rawTemplate, setRawTemplate] = useState<string | null>(null)

  // ── Grupo modal ──
  const { isOpen: isGrupoOpen, onOpen: onGrupoOpen, onClose: onGrupoClose } = useDisclosure()
  const [grupoForm, setGrupoForm] = useState<GrupoFormData>({ nome: '', link: '', tipo: 'geral', referencia_id: '' })
  const [editingGrupo, setEditingGrupo] = useState<GrupoWhatsApp | null>(null)
  const [salvandoGrupo, setSalvandoGrupo] = useState(false)

  // ── Delete grupo ──
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [deletingGrupo, setDeletingGrupo] = useState<GrupoWhatsApp | null>(null)

  // ── WhatsApp ──
  const [waStatus, setWaStatus] = useState<WaStatus>('disconnected')
  const [waQr, setWaQr] = useState<string | null>(null)
  const [waNumber, setWaNumber] = useState<string | null>(null)
  const { isOpen: isQrOpen, onOpen: onQrOpen, onClose: onQrClose } = useDisclosure()

  // ── SSE WhatsApp ──
  useEffect(() => {
    const cleanup = subscribeWaEvents((ev) => {
      if (ev.type === 'qr') {
        setWaStatus('qr')
        setWaQr(ev.qr ?? null)
        onQrOpen()
      } else if (ev.type === 'status') {
        setWaStatus(ev.status ?? 'disconnected')
        if (ev.number) setWaNumber(ev.number)
        if (ev.status === 'connected') { setWaQr(null); onQrClose() }
        if (ev.status === 'disconnected') { setWaQr(null); setWaNumber(null) }
      }
    })
    return cleanup
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Carregamento ──
  const loadAll = useCallback(async () => {
    try {
      const data = await carregarDadosMensagens()
      setAlunos(data.alunos)
      setTurmas(data.turmas)
      setModalidades(data.modalidades)
      setAlunosTurmaMap(data.alunosTurmaMap)
      setGrupos(data.grupos)
      setHistorico(data.historico)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar dados', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    }
  }, [toast])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Destinatários ──
  function getDestinatarios(): AlunoMsg[] {
    switch (tipoEnvio) {
      case 'aluno':
        return alunos.filter((a) => a.idaluno === Number(selectedAlunoId))
      case 'turma': {
        const ids = new Set(alunosTurmaMap.filter((m) => m.turma_id === Number(selectedTurmaId)).map((m) => m.aluno_id))
        return alunos.filter((a) => ids.has(a.idaluno))
      }
      case 'modalidade':
        return alunos.filter((a) => a.modalidade_id === Number(selectedModalidadeId))
      case 'todos':
        return alunos
      default:
        return []
    }
  }

  function getDestinoLabel(): string {
    switch (tipoEnvio) {
      case 'aluno': return alunos.find((a) => a.idaluno === Number(selectedAlunoId))?.nome ?? ''
      case 'turma': { const t = turmas.find((t) => t.idturma === Number(selectedTurmaId)); return t ? `Turma: ${t.nome}` : '' }
      case 'modalidade': { const m = modalidades.find((m) => m.idmodalidade === Number(selectedModalidadeId)); return m ? `Modalidade: ${m.nome}` : '' }
      case 'todos': return 'Todos os alunos'
      case 'grupo': { const g = grupos.find((g) => g.id === Number(selectedGrupoId)); return g ? `Grupo: ${g.nome}` : '' }
      default: return ''
    }
  }

  // ── Envio ──
  const handleSend = async () => {
    if (!mensagem.trim()) {
      toast({ title: 'Digite uma mensagem', status: 'warning', duration: 3000, position: 'top-right' })
      return
    }

    if (tipoEnvio === 'grupo') {
      const grupo = grupos.find((g) => g.id === Number(selectedGrupoId))
      if (!grupo) { toast({ title: 'Selecione um grupo', status: 'warning', duration: 3000, position: 'top-right' }); return }
      setSending(true)
      openGrupoLink(grupo.link)
      try { await navigator.clipboard.writeText(mensagem) } catch { /* silent */ }
      toast({ title: 'Grupo aberto!', description: 'Mensagem copiada para a área de transferência. Cole no grupo.', status: 'info', duration: 6000, position: 'top-right' })
      await registrarMensagem({ tipo: 'grupo', destino: grupo.nome, mensagem })
      await loadAll()
      setMensagem(''); setRawTemplate(null)
      setSending(false)
      return
    }

    const destinatarios = getDestinatarios()
    if (destinatarios.length === 0) {
      toast({ title: 'Selecione um destinatário', status: 'warning', duration: 3000, position: 'top-right' })
      return
    }

    setSending(true)

    if (waStatus === 'connected') {
      try {
        const phones = destinatarios.map((a) => normalizeTelefone(a.telefone))
        if (phones.length === 1) {
          await sendWaMessage(phones[0], mensagem)
        } else {
          await sendWaBulk(phones, mensagem)
        }
        await registrarMensagem({ tipo: tipoEnvio, destino: getDestinoLabel(), mensagem })
        toast({ title: 'Mensagem enviada!', description: `${destinatarios.length} destinatário(s) via WhatsApp conectado.`, status: 'success', duration: 5000, position: 'top-right' })
      } catch (err: any) {
        toast({ title: 'Erro ao enviar', description: err.message, status: 'error', duration: 5000, position: 'top-right' })
      }
    } else {
      const MAX = 10
      if (destinatarios.length > MAX) {
        toast({ title: `${destinatarios.length} alunos`, description: `Somente as primeiras ${MAX} abas serão abertas. Use um Grupo para envios em massa.`, status: 'warning', duration: 8000, position: 'top-right' })
      }
      destinatarios.slice(0, MAX).forEach((a, i) => setTimeout(() => openWhatsApp(a.telefone, mensagem), i * 600))
      await registrarMensagem({ tipo: tipoEnvio, destino: getDestinoLabel(), mensagem })
      toast({ title: 'Enviando!', description: `${Math.min(destinatarios.length, MAX)} conversa(s) aberta(s) no WhatsApp.`, status: 'success', duration: 5000, position: 'top-right' })
    }

    await loadAll()
    setMensagem(''); setRawTemplate(null)
    setSending(false)
  }

  // ── Grupos CRUD ──
  function handleNewGrupo() {
    setEditingGrupo(null)
    setGrupoForm({ nome: '', link: '', tipo: 'geral', referencia_id: '' })
    onGrupoOpen()
  }

  function handleEditGrupo(g: GrupoWhatsApp) {
    setEditingGrupo(g)
    setGrupoForm({ nome: g.nome, link: g.link, tipo: g.tipo, referencia_id: g.referencia_id?.toString() ?? '' })
    onGrupoOpen()
  }

  async function handleSaveGrupo() {
    if (!grupoForm.nome.trim() || !grupoForm.link.trim()) {
      toast({ title: 'Preencha nome e link do grupo', status: 'warning', duration: 3000, position: 'top-right' })
      return
    }
    const payload = {
      nome: grupoForm.nome,
      link: grupoForm.link,
      tipo: grupoForm.tipo,
      referencia_id: grupoForm.referencia_id ? Number(grupoForm.referencia_id) : null,
    }
    try {
      setSalvandoGrupo(true)
      if (editingGrupo) {
        await editarGrupo(editingGrupo.id, payload)
        toast({ title: 'Grupo atualizado!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarGrupo(payload)
        toast({ title: 'Grupo cadastrado!', status: 'success', duration: 3000, position: 'top-right' })
      }
      onGrupoClose()
      await loadAll()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar grupo', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvandoGrupo(false)
    }
  }

  async function confirmDeleteGrupo() {
    if (!deletingGrupo) return
    try {
      await deletarGrupo(deletingGrupo.id)
      toast({ title: 'Grupo removido', status: 'success', duration: 3000, position: 'top-right' })
      onDeleteClose()
      await loadAll()
    } catch (err: any) {
      toast({ title: 'Erro ao remover grupo', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    }
  }

  // ── Computed ──
  const destinatarios = tipoEnvio !== 'grupo' ? getDestinatarios() : []
  const canSend = mensagem.trim().length > 0 && (
    tipoEnvio === 'todos' ||
    (tipoEnvio === 'aluno' && !!selectedAlunoId) ||
    (tipoEnvio === 'turma' && !!selectedTurmaId) ||
    (tipoEnvio === 'modalidade' && !!selectedModalidadeId) ||
    (tipoEnvio === 'grupo' && !!selectedGrupoId)
  )

  // ── Render ──
  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">

      {/* Header */}
      <Flex align="center" gap={3} mb={6}>
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center" flexShrink={0}>
          <Icon as={FiMessageSquare} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="xl" fontWeight="800" color="gray.800" lineHeight="1.2">
            Central de Mensagens
          </Text>
          <Text fontSize="sm" color="gray.400">
            Envie mensagens via WhatsApp para alunos, turmas ou modalidades
          </Text>
        </Box>
      </Flex>

      <Flex gap={6} direction={{ base: 'column', xl: 'row' }} align="start">

        {/* Compor Mensagem */}
        <ComporMensagem
          alunos={alunos}
          turmas={turmas}
          modalidades={modalidades}
          grupos={grupos}
          destinatarios={destinatarios}
          tipoEnvio={tipoEnvio}
          setTipoEnvio={setTipoEnvio}
          selectedAlunoId={selectedAlunoId}
          setSelectedAlunoId={setSelectedAlunoId}
          selectedTurmaId={selectedTurmaId}
          setSelectedTurmaId={setSelectedTurmaId}
          selectedModalidadeId={selectedModalidadeId}
          setSelectedModalidadeId={setSelectedModalidadeId}
          selectedGrupoId={selectedGrupoId}
          setSelectedGrupoId={setSelectedGrupoId}
          mensagem={mensagem}
          setMensagem={setMensagem}
          rawTemplate={rawTemplate}
          setRawTemplate={setRawTemplate}
          sending={sending}
          canSend={canSend}
          waStatus={waStatus}
          onSend={handleSend}
          onNewGrupo={handleNewGrupo}
        />

        {/* Sidebar */}
        <Box w={{ base: 'full', xl: '380px' }} flexShrink={0}>

          <ConexaoWhatsApp
            waStatus={waStatus}
            waNumber={waNumber}
            waQr={waQr}
            isQrOpen={isQrOpen}
            onQrClose={onQrClose}
            onConnect={async () => {
              try {
                setWaStatus('connecting')
                await connectWa()
              } catch {
                setWaStatus('disconnected')
                toast({ title: 'Erro ao conectar', description: 'Verifique se o serviço WhatsApp está rodando.', status: 'error', duration: 5000, position: 'top-right' })
              }
            }}
            onDisconnect={async () => {
              try {
                await disconnectWa()
                setWaStatus('disconnected')
                setWaNumber(null)
                toast({ title: 'WhatsApp desconectado', status: 'info', duration: 3000, position: 'top-right' })
              } catch {
                toast({ title: 'Erro ao desconectar', status: 'error', duration: 3000, position: 'top-right' })
              }
            }}
          />

          <GruposWhatsApp
            grupos={grupos}
            onNew={handleNewGrupo}
            onEdit={handleEditGrupo}
            onDelete={(g) => { setDeletingGrupo(g); onDeleteOpen() }}
            deletingGrupo={deletingGrupo}
            isDeleteOpen={isDeleteOpen}
            onDeleteClose={onDeleteClose}
            onConfirmDelete={confirmDeleteGrupo}
          />

          <HistoricoEnvios
            historico={historico}
            onHistoricoLimpo={() => setHistorico([])}
          />

        </Box>
      </Flex>

      {/* Modal Grupo */}
      <ModalGrupo
        isOpen={isGrupoOpen}
        onClose={onGrupoClose}
        isEditing={!!editingGrupo}
        form={grupoForm}
        setForm={setGrupoForm}
        turmas={turmas}
        modalidades={modalidades}
        salvando={salvandoGrupo}
        onSave={handleSaveGrupo}
      />
    </Box>
  )
}
