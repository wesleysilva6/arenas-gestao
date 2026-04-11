import { useEffect, useState, useCallback, useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tag,
  Text,
  Textarea,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import {
  FiClock,
  FiEdit2,
  FiExternalLink,
  FiGrid,
  FiLayers,
  FiLink,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiSmartphone,
  FiTrash2,
  FiUser,
  FiUsers,
  FiWifi,
  FiWifiOff,
} from 'react-icons/fi'
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

type TipoEnvio = 'aluno' | 'turma' | 'modalidade' | 'todos' | 'grupo'

const inputStyle = {
  bg: 'gray.50',
  border: '1px solid',
  borderColor: 'gray.200',
  rounded: 'xl',
  fontSize: 'sm' as const,
  _focus: {
    bg: 'white',
    borderColor: 'brand.400',
    boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
  },
}

export default function MensagensPage() {
  const toast = useToast()

  const [alunos, setAlunos] = useState<AlunoMsg[]>([])
  const [turmas, setTurmas] = useState<TurmaMsg[]>([])
  const [modalidades, setModalidades] = useState<ModalidadeMsg[]>([])
  const [alunosTurmaMap, setAlunosTurmaMap] = useState<AlunoTurmaMap[]>([])
  const [grupos, setGrupos] = useState<GrupoWhatsApp[]>([])
  const [historico, setHistorico] = useState<MensagemLog[]>([])
  const [sending, setSending] = useState(false)

  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>('aluno')
  const [selectedAlunoId, setSelectedAlunoId] = useState('')
  const [selectedTurmaId, setSelectedTurmaId] = useState('')
  const [selectedModalidadeId, setSelectedModalidadeId] = useState('')
  const [selectedGrupoId, setSelectedGrupoId] = useState('')
  const [mensagem, setMensagem] = useState('')

  // Grupo modal
  const { isOpen: isGrupoOpen, onOpen: onGrupoOpen, onClose: onGrupoClose } = useDisclosure()
  const [grupoForm, setGrupoForm] = useState({ nome: '', link: '', tipo: 'geral' as 'turma' | 'modalidade' | 'geral', referencia_id: '' })
  const [editingGrupo, setEditingGrupo] = useState<GrupoWhatsApp | null>(null)
  const [salvandoGrupo, setSalvandoGrupo] = useState(false)

  // Delete dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [deletingGrupo, setDeletingGrupo] = useState<GrupoWhatsApp | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // WhatsApp connection
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
        if (ev.status === 'connected') {
          setWaQr(null)
          onQrClose()
        }
        if (ev.status === 'disconnected') {
          setWaQr(null)
          setWaNumber(null)
        }
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
      setMensagem('')
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
      // Envio automático via API
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
      // Fallback: abrir wa.me links
      const MAX = 10
      if (destinatarios.length > MAX) {
        toast({ title: `${destinatarios.length} alunos`, description: `Somente as primeiras ${MAX} abas serão abertas. Use um Grupo para envios em massa.`, status: 'warning', duration: 8000, position: 'top-right' })
      }
      destinatarios.slice(0, MAX).forEach((a, i) => setTimeout(() => openWhatsApp(a.telefone, mensagem), i * 600))
      await registrarMensagem({ tipo: tipoEnvio, destino: getDestinoLabel(), mensagem })
      toast({ title: 'Enviando!', description: `${Math.min(destinatarios.length, MAX)} conversa(s) aberta(s) no WhatsApp.`, status: 'success', duration: 5000, position: 'top-right' })
    }

    await loadAll()
    setMensagem('')
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

  function clearSelections() {
    setSelectedAlunoId('')
    setSelectedTurmaId('')
    setSelectedModalidadeId('')
    setSelectedGrupoId('')
  }

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

        {/* ── Compor Mensagem ── */}
        <Box flex={1} bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={6}>
          <HStack mb={5}>
            <Flex w={9} h={9} rounded="xl" bg="brand.50" align="center" justify="center">
              <Icon as={FiMessageSquare} boxSize={5} color="brand.600" />
            </Flex>
            <Text fontSize="md" fontWeight="700" color="gray.700">Compor mensagem</Text>
          </HStack>

          {/* Tipo de envio */}
          <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={2}>
            Enviar para
          </Text>
          <Wrap spacing={2} mb={5}>
            {([
              { value: 'aluno', label: 'Aluno', icon: FiUser },
              { value: 'turma', label: 'Turma', icon: FiLayers },
              { value: 'modalidade', label: 'Modalidade', icon: FiGrid },
              { value: 'todos', label: 'Todos os alunos', icon: FiUsers },
              { value: 'grupo', label: 'Grupo WhatsApp', icon: FiLink },
            ] as { value: TipoEnvio; label: string; icon: React.ElementType }[]).map((opt) => {
              const active = tipoEnvio === opt.value
              return (
                <WrapItem key={opt.value}>
                  <Button
                    size="sm"
                    variant={active ? 'solid' : 'outline'}
                    colorScheme={active ? 'green' : 'gray'}
                    leftIcon={<Icon as={opt.icon} />}
                    onClick={() => { setTipoEnvio(opt.value); clearSelections() }}
                    rounded="lg"
                    fontWeight={active ? '600' : '400'}
                  >
                    {opt.label}
                  </Button>
                </WrapItem>
              )
            })}
          </Wrap>

          {/* Seletor de destinatário */}
          {tipoEnvio === 'aluno' && (
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Selecione o aluno</FormLabel>
              <Select placeholder="Selecione" value={selectedAlunoId} onChange={(e) => setSelectedAlunoId(e.target.value)} {...inputStyle}>
                {alunos.map((a) => (
                  <option key={a.idaluno} value={a.idaluno}>{a.nome} — {a.telefone}</option>
                ))}
              </Select>
            </FormControl>
          )}

          {tipoEnvio === 'turma' && (
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Selecione a turma</FormLabel>
              <Select placeholder="Selecione" value={selectedTurmaId} onChange={(e) => setSelectedTurmaId(e.target.value)} {...inputStyle}>
                {turmas.map((t) => (
                  <option key={t.idturma} value={t.idturma}>{t.nome} — {t.modalidade_nome}</option>
                ))}
              </Select>
            </FormControl>
          )}

          {tipoEnvio === 'modalidade' && (
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Selecione a modalidade</FormLabel>
              <Select placeholder="Selecione" value={selectedModalidadeId} onChange={(e) => setSelectedModalidadeId(e.target.value)} {...inputStyle}>
                {modalidades.map((m) => (
                  <option key={m.idmodalidade} value={m.idmodalidade}>{m.nome}</option>
                ))}
              </Select>
            </FormControl>
          )}

          {tipoEnvio === 'grupo' && (
            <FormControl mb={4}>
              <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Selecione o grupo</FormLabel>
              <HStack>
                <Select placeholder="Selecione" value={selectedGrupoId} onChange={(e) => setSelectedGrupoId(e.target.value)} flex={1} {...inputStyle}>
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>{g.nome}</option>
                  ))}
                </Select>
                <Tooltip label="Adicionar grupo">
                  <IconButton aria-label="Novo grupo" icon={<FiPlus />} colorScheme="green" variant="outline" rounded="lg" onClick={handleNewGrupo} />
                </Tooltip>
              </HStack>
            </FormControl>
          )}

          {tipoEnvio === 'todos' && (
            <Flex mb={4} p={3} rounded="xl" align="center" gap={3} bg="green.50" border="1px solid" borderColor="green.200">
              <Icon as={FiUsers} color="green.500" boxSize={5} />
              <Text fontSize="sm" color="green.700">
                Mensagem para <b>{alunos.length}</b> aluno{alunos.length !== 1 ? 's' : ''} ativo{alunos.length !== 1 ? 's' : ''}.
              </Text>
            </Flex>
          )}

          {/* Preview destinatários */}
          {tipoEnvio !== 'todos' && tipoEnvio !== 'grupo' && destinatarios.length > 0 && (
            <Box mb={4} p={3} rounded="xl" bg="gray.50" border="1px solid" borderColor="gray.200" maxH="110px" overflowY="auto">
              <Text fontSize="xs" color="gray.500" mb={2} fontWeight="600">{destinatarios.length} destinatário(s)</Text>
              <Wrap spacing={2}>
                {destinatarios.map((d) => (
                  <WrapItem key={d.idaluno}>
                    <Tag size="sm" rounded="full" bg="brand.50" color="brand.700" border="1px solid" borderColor="brand.100">
                      <Avatar size="2xs" name={d.nome} mr={1} />{d.nome}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {/* Textarea */}
          <FormControl mb={4}>
            <FormLabel fontSize="sm" color="gray.600" fontWeight="600">Mensagem</FormLabel>
            <Textarea
              placeholder={'Digite sua mensagem...\n\nEx: Atenção turma de Beach Tennis!\nO treino de amanhã será às 18h.'}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={6}
              {...inputStyle}
              resize="vertical"
            />
            <Text fontSize="xs" color="gray.400" mt={1}>{mensagem.length} caracteres</Text>
          </FormControl>

          <Button
            colorScheme="green"
            size="lg"
            w="full"
            leftIcon={<Icon as={FiSend} />}
            onClick={handleSend}
            isLoading={sending}
            loadingText="Enviando..."
            isDisabled={!canSend}
            rounded="xl"
            fontWeight="700"
            _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
            transition="all 0.2s"
          >
            {tipoEnvio === 'grupo' ? 'Abrir Grupo e Copiar Mensagem' : waStatus === 'connected' ? 'Enviar Mensagem' : 'Enviar via WhatsApp'}
          </Button>

          {waStatus === 'connected' && tipoEnvio !== 'grupo' && (
            <Flex mt={3} p={3} rounded="lg" bg="green.50" border="1px solid" borderColor="green.200" align="center" gap={2}>
              <Icon as={FiWifi} color="green.500" boxSize={4} />
              <Text fontSize="xs" color="green.700">
                Envio automático — sem abrir abas do navegador.
              </Text>
            </Flex>
          )}

          {tipoEnvio !== 'grupo' && destinatarios.length > 10 && (
            <Flex mt={3} p={3} rounded="lg" bg="orange.50" border="1px solid" borderColor="orange.200" align="center" gap={2}>
              <Text fontSize="xs" color="orange.700">
                Muitos destinatários — use um Grupo WhatsApp para envios em massa.
              </Text>
            </Flex>
          )}
        </Box>

        {/* ── Sidebar ── */}
        <Box w={{ base: 'full', xl: '380px' }} flexShrink={0}>

          {/* Conexão WhatsApp */}
          <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5} mb={5}>
            <HStack mb={4}>
              <Flex w={8} h={8} rounded="lg" bg={waStatus === 'connected' ? 'green.50' : 'gray.50'} align="center" justify="center">
                <Icon as={waStatus === 'connected' ? FiWifi : FiWifiOff} boxSize={4} color={waStatus === 'connected' ? 'green.600' : 'gray.400'} />
              </Flex>
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="700" color="gray.700">WhatsApp</Text>
                <HStack spacing={1} mt={0.5}>
                  <Box w={2} h={2} rounded="full" bg={waStatus === 'connected' ? 'green.400' : waStatus === 'connecting' || waStatus === 'qr' ? 'orange.400' : 'gray.300'} />
                  <Text fontSize="xs" color="gray.500">
                    {waStatus === 'connected' ? `Conectado${waNumber ? ` — ${waNumber}` : ''}`
                      : waStatus === 'connecting' ? 'Conectando...'
                      : waStatus === 'qr' ? 'Aguardando leitura do QR...'
                      : 'Desconectado'}
                  </Text>
                </HStack>
              </Box>
            </HStack>

            {waStatus === 'connected' ? (
              <Button
                size="sm"
                w="full"
                variant="outline"
                colorScheme="red"
                leftIcon={<FiWifiOff />}
                rounded="lg"
                onClick={async () => {
                  try {
                    await disconnectWa()
                    setWaStatus('disconnected')
                    setWaNumber(null)
                    toast({ title: 'WhatsApp desconectado', status: 'info', duration: 3000, position: 'top-right' })
                  } catch {
                    toast({ title: 'Erro ao desconectar', status: 'error', duration: 3000, position: 'top-right' })
                  }
                }}
              >
                Desconectar
              </Button>
            ) : waStatus === 'connecting' || waStatus === 'qr' ? (
              <Button size="sm" w="full" variant="outline" colorScheme="orange" rounded="lg" isLoading loadingText="Conectando..." isDisabled />
            ) : (
              <Button
                size="sm"
                w="full"
                colorScheme="green"
                leftIcon={<FiSmartphone />}
                rounded="lg"
                onClick={async () => {
                  try {
                    setWaStatus('connecting')
                    await connectWa()
                  } catch {
                    setWaStatus('disconnected')
                    toast({ title: 'Erro ao conectar', description: 'Verifique se o serviço WhatsApp está rodando.', status: 'error', duration: 5000, position: 'top-right' })
                  }
                }}
              >
                Conectar WhatsApp
              </Button>
            )}

            {waStatus === 'connected' && (
              <Flex mt={3} p={2} rounded="lg" bg="green.50" border="1px solid" borderColor="green.100" align="center" gap={2}>
                <Icon as={FiSend} color="green.500" boxSize={3.5} />
                <Text fontSize="xs" color="green.700">Mensagens serão enviadas automaticamente.</Text>
              </Flex>
            )}

            {waStatus === 'disconnected' && (
              <Flex mt={3} p={2} rounded="lg" bg="gray.50" border="1px solid" borderColor="gray.100" align="center" gap={2}>
                <Icon as={FiExternalLink} color="gray.400" boxSize={3.5} />
                <Text fontSize="xs" color="gray.500">Sem conexão — links wa.me serão abertos.</Text>
              </Flex>
            )}
          </Box>

          {/* Grupos WhatsApp */}
          <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5} mb={5}>
            <Flex justify="space-between" align="center" mb={4}>
              <HStack>
                <Flex w={8} h={8} rounded="lg" bg="green.50" align="center" justify="center">
                  <Icon as={FiLink} boxSize={4} color="green.600" />
                </Flex>
                <Text fontSize="sm" fontWeight="700" color="gray.700">Grupos WhatsApp</Text>
              </HStack>
              <Button size="xs" leftIcon={<FiPlus />} colorScheme="green" variant="ghost" onClick={handleNewGrupo} rounded="lg">
                Adicionar
              </Button>
            </Flex>

            {grupos.length === 0 ? (
              <Box textAlign="center" py={6} px={4}>
                <Flex w={12} h={12} rounded="2xl" bg="gray.50" align="center" justify="center" mx="auto" mb={3}>
                  <Icon as={FiLink} boxSize={5} color="gray.400" />
                </Flex>
                <Text fontSize="sm" color="gray.500" fontWeight="600">Nenhum grupo cadastrado</Text>
                <Text fontSize="xs" color="gray.400" mt={1}>Adicione links de grupos do WhatsApp para facilitar envios em massa.</Text>
              </Box>
            ) : (
              <VStack spacing={2} align="stretch">
                {grupos.map((g) => (
                  <Flex
                    key={g.id}
                    p={3}
                    rounded="xl"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.100"
                    align="center"
                    justify="space-between"
                    _hover={{ bg: 'gray.100' }}
                    transition="all 0.15s"
                  >
                    <Box flex={1} minW={0}>
                      <Text fontSize="sm" fontWeight="600" color="gray.800" isTruncated>{g.nome}</Text>
                      <Badge
                        mt={1}
                        colorScheme={g.tipo === 'turma' ? 'blue' : g.tipo === 'modalidade' ? 'purple' : 'green'}
                        rounded="full"
                        fontSize="2xs"
                        px={2}
                      >
                        {g.tipo === 'turma' ? 'Turma' : g.tipo === 'modalidade' ? 'Modalidade' : 'Geral'}
                      </Badge>
                    </Box>
                    <HStack spacing={0}>
                      <Tooltip label="Abrir grupo">
                        <IconButton
                          aria-label="Abrir"
                          icon={<FiExternalLink />}
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'green.500' }}
                          onClick={() => openGrupoLink(g.link)}
                        />
                      </Tooltip>
                      <Tooltip label="Editar">
                        <IconButton
                          aria-label="Editar"
                          icon={<FiEdit2 />}
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'blue.500' }}
                          onClick={() => handleEditGrupo(g)}
                        />
                      </Tooltip>
                      <Tooltip label="Remover">
                        <IconButton
                          aria-label="Remover"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: 'red.500' }}
                          onClick={() => { setDeletingGrupo(g); onDeleteOpen() }}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>

          {/* Histórico de envios */}
          <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5}>
            <HStack mb={4}>
              <Flex w={8} h={8} rounded="lg" bg="gray.50" align="center" justify="center">
                <Icon as={FiClock} boxSize={4} color="gray.500" />
              </Flex>
              <Text fontSize="sm" fontWeight="700" color="gray.700">Histórico de envios</Text>
            </HStack>

            {historico.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Text fontSize="sm" color="gray.400">Nenhuma mensagem enviada ainda.</Text>
              </Box>
            ) : (
              <VStack spacing={2} align="stretch" maxH="380px" overflowY="auto">
                {historico.map((h) => (
                  <Box key={h.idmensagem} p={3} rounded="xl" bg="gray.50" border="1px solid" borderColor="gray.100">
                    <Flex justify="space-between" align="center" mb={1}>
                      <Badge
                        rounded="full"
                        fontSize="2xs"
                        px={2}
                        colorScheme={
                          h.tipo === 'aluno' ? 'cyan'
                            : h.tipo === 'turma' ? 'blue'
                            : h.tipo === 'modalidade' ? 'purple'
                            : h.tipo === 'grupo' ? 'green'
                            : 'orange'
                        }
                      >
                        {h.tipo === 'aluno' ? 'Aluno' : h.tipo === 'turma' ? 'Turma' : h.tipo === 'modalidade' ? 'Modalidade' : h.tipo === 'grupo' ? 'Grupo' : 'Todos'}
                      </Badge>
                      <Text fontSize="xs" color="gray.400">
                        {new Date(h.enviado_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Flex>
                    {h.destino && <Text fontSize="xs" color="gray.500" mb={1}>→ {h.destino}</Text>}
                    <Text fontSize="sm" color="gray.700" noOfLines={2}>{h.mensagem}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </Flex>

      {/* ── Modal: Cadastrar/Editar Grupo ── */}
      <Modal isOpen={isGrupoOpen} onClose={onGrupoClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader color="gray.800" fontSize="lg" fontWeight="700">
            {editingGrupo ? 'Editar Grupo' : 'Novo Grupo WhatsApp'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">Nome do grupo</FormLabel>
                <Input
                  placeholder="Ex: Beach Tennis — Avançado"
                  value={grupoForm.nome}
                  onChange={(e) => setGrupoForm({ ...grupoForm, nome: e.target.value })}
                  {...inputStyle}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">Link do grupo</FormLabel>
                <Input
                  placeholder="https://chat.whatsapp.com/..."
                  value={grupoForm.link}
                  onChange={(e) => setGrupoForm({ ...grupoForm, link: e.target.value })}
                  {...inputStyle}
                />
                <Text fontSize="xs" color="gray.400" mt={1}>
                  No WhatsApp: Grupo → Configurações → Link de convite → Copiar
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">Tipo</FormLabel>
                <Select
                  value={grupoForm.tipo}
                  onChange={(e) => setGrupoForm({ ...grupoForm, tipo: e.target.value as any, referencia_id: '' })}
                  {...inputStyle}
                >
                  <option value="geral">Geral</option>
                  <option value="turma">Turma</option>
                  <option value="modalidade">Modalidade</option>
                </Select>
              </FormControl>
              {grupoForm.tipo === 'turma' && (
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">Turma vinculada</FormLabel>
                  <Select
                    placeholder="Selecione"
                    value={grupoForm.referencia_id}
                    onChange={(e) => setGrupoForm({ ...grupoForm, referencia_id: e.target.value })}
                    {...inputStyle}
                  >
                    {turmas.map((t) => (
                      <option key={t.idturma} value={t.idturma}>{t.nome}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
              {grupoForm.tipo === 'modalidade' && (
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">Modalidade vinculada</FormLabel>
                  <Select
                    placeholder="Selecione"
                    value={grupoForm.referencia_id}
                    onChange={(e) => setGrupoForm({ ...grupoForm, referencia_id: e.target.value })}
                    {...inputStyle}
                  >
                    {modalidades.map((m) => (
                      <option key={m.idmodalidade} value={m.idmodalidade}>{m.nome}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGrupoClose} color="gray.500">Cancelar</Button>
            <Button
              colorScheme="green"
              onClick={handleSaveGrupo}
              isLoading={salvandoGrupo}
              rounded="lg"
              fontWeight="700"
            >
              {editingGrupo ? 'Salvar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── AlertDialog: Remover Grupo ── */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef as any} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent rounded="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
              Remover grupo
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              Tem certeza que deseja remover o grupo <b>{deletingGrupo?.nome}</b>?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" color="gray.500" onClick={onDeleteClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={confirmDeleteGrupo} ml={3} rounded="lg">Remover</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ── Modal: QR Code WhatsApp ── */}
      <Modal isOpen={isQrOpen} onClose={onQrClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader color="gray.800" fontSize="lg" fontWeight="700" textAlign="center">
            Conectar WhatsApp
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              {waQr ? (
                <>
                  <Image src={waQr} alt="QR Code WhatsApp" w="260px" h="260px" rounded="xl" border="1px solid" borderColor="gray.200" />
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Abra o WhatsApp no seu celular, vá em <b>Dispositivos conectados</b> e escaneie o QR Code acima.
                  </Text>
                </>
              ) : (
                <VStack py={8} spacing={3}>
                  <CircularProgress isIndeterminate color="green.400" size="50px" />
                  <Text fontSize="sm" color="gray.500">Gerando QR Code...</Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
