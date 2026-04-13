import { useEffect, useState, useRef } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Select,
  Tag,
  Text,
  Textarea,
  Tooltip,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiGrid,
  FiLayers,
  FiLink,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiUser,
  FiUsers,
  FiWifi,
} from 'react-icons/fi'
import type { AlunoMsg, TurmaMsg, ModalidadeMsg, GrupoWhatsApp } from '../../../service/mensagens'
import { formatPhone } from '../../../utils/formatters'
import type { WaStatus } from '../../../service/whatsapp'
import { TEMPLATES, inputStyle, type TipoEnvio } from './templates'

interface Props {
  alunos: AlunoMsg[]
  turmas: TurmaMsg[]
  modalidades: ModalidadeMsg[]
  grupos: GrupoWhatsApp[]
  destinatarios: AlunoMsg[]
  tipoEnvio: TipoEnvio
  setTipoEnvio: (t: TipoEnvio) => void
  selectedAlunoId: string
  setSelectedAlunoId: (id: string) => void
  selectedTurmaId: string
  setSelectedTurmaId: (id: string) => void
  selectedModalidadeId: string
  setSelectedModalidadeId: (id: string) => void
  selectedGrupoId: string
  setSelectedGrupoId: (id: string) => void
  mensagem: string
  setMensagem: (msg: string) => void
  rawTemplate: string | null
  setRawTemplate: (tpl: string | null) => void
  sending: boolean
  canSend: boolean
  waStatus: WaStatus
  onSend: () => void
  onNewGrupo: () => void
}

export default function ComporMensagem({
  alunos, turmas, modalidades, grupos, destinatarios,
  tipoEnvio, setTipoEnvio,
  selectedAlunoId, setSelectedAlunoId,
  selectedTurmaId, setSelectedTurmaId,
  selectedModalidadeId, setSelectedModalidadeId,
  selectedGrupoId, setSelectedGrupoId,
  mensagem, setMensagem,
  rawTemplate, setRawTemplate,
  sending, canSend, waStatus,
  onSend, onNewGrupo,
}: Props) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [activeCategoria, setActiveCategoria] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Substituição de placeholders ──
  function substituirPlaceholders(texto: string, alunoId: string, turmaId: string): string {
    const aluno = alunos.find((a) => String(a.idaluno) === alunoId)
    const turma = turmas.find((t) => String(t.idturma) === turmaId)
    const today = new Date()
    let result = texto

    if (aluno) {
      result = result.replace(/\{nome\}/g, aluno.nome ?? '')
      const valor = Number(aluno.valor_mensalidade ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      result = result.replace(/\{valor\}/g, valor)
      const dia = Number(aluno.dia_vencimento) || 10
      const venc = new Date(today.getFullYear(), today.getMonth(), dia)
      if (venc <= today) venc.setMonth(venc.getMonth() + 1)
      result = result.replace(/\{vencimento\}/g, venc.toLocaleDateString('pt-BR'))
      if (aluno.data_vencimento_contrato) {
        const partes = String(aluno.data_vencimento_contrato).substring(0, 10).split('-')
        if (partes.length === 3) {
          result = result.replace(/\{fim_contrato\}/g, `${partes[2]}/${partes[1]}/${partes[0]}`)
        }
      }
    }
    if (turma) {
      result = result.replace(/\{nome\}/g, turma.nome ?? '')
      const hora = turma.horario ? String(turma.horario).substring(0, 5) : '{horario}'
      result = result.replace(/\{horario\}/g, hora)
    }
    return result
  }

  function applyTemplate(texto: string) {
    setRawTemplate(texto)
    setMensagem(substituirPlaceholders(texto, selectedAlunoId, selectedTurmaId))
    setShowTemplates(false)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  // Re-aplica template quando aluno/turma muda
  useEffect(() => {
    if (rawTemplate) {
      setMensagem(substituirPlaceholders(rawTemplate, selectedAlunoId, selectedTurmaId))
    }
  }, [selectedAlunoId, selectedTurmaId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Templates filtrados pelo contexto
  const templatesFiltrados = TEMPLATES.map((cat) => ({
    ...cat,
    itens: cat.itens.filter((tpl) => tpl.contextos.includes(tipoEnvio)),
  })).filter((cat) => cat.itens.length > 0)

  const categoriaAtiva = Math.min(activeCategoria, templatesFiltrados.length - 1)

  function clearSelections() {
    setSelectedAlunoId('')
    setSelectedTurmaId('')
    setSelectedModalidadeId('')
    setSelectedGrupoId('')
  }

  return (
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
              <option key={a.idaluno} value={a.idaluno}>{a.nome} — {formatPhone(a.telefone)}</option>
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
              <IconButton aria-label="Novo grupo" icon={<FiPlus />} colorScheme="green" variant="outline" rounded="lg" onClick={onNewGrupo} />
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

      {/* Mensagens prontas */}
      <Box mb={4}>
        <Button
          variant="ghost"
          size="sm"
          w="full"
          justifyContent="space-between"
          leftIcon={<Icon as={FiFileText} />}
          rightIcon={<Icon as={showTemplates ? FiChevronUp : FiChevronDown} />}
          onClick={() => setShowTemplates(!showTemplates)}
          color="gray.600"
          fontWeight="600"
          fontSize="sm"
          px={0}
          _hover={{ bg: 'transparent', color: 'brand.600' }}
        >
          Mensagens prontas
        </Button>
        {showTemplates && (
          <Box pt={3}>
            {templatesFiltrados.length === 0 ? (
              <Text fontSize="sm" color="gray.400" textAlign="center" py={3}>
                Nenhum template disponível para o tipo de envio selecionado.
              </Text>
            ) : (
              <>
                <HStack spacing={2} mb={3} overflowX="auto" pb={1}>
                  {templatesFiltrados.map((cat, i) => (
                    <Button
                      key={cat.categoria}
                      size="xs"
                      variant={categoriaAtiva === i ? 'solid' : 'outline'}
                      colorScheme={categoriaAtiva === i ? cat.cor : 'gray'}
                      onClick={() => setActiveCategoria(i)}
                      rounded="full"
                      fontWeight={categoriaAtiva === i ? '700' : '500'}
                      flexShrink={0}
                    >
                      {cat.categoria}
                    </Button>
                  ))}
                </HStack>
                {templatesFiltrados[categoriaAtiva] && (
                  <VStack spacing={2} align="stretch">
                    {templatesFiltrados[categoriaAtiva].itens.map((tpl) => (
                      <Box
                        key={tpl.titulo}
                        role="button"
                        tabIndex={0}
                        textAlign="left"
                        onClick={() => applyTemplate(tpl.texto)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') applyTemplate(tpl.texto) }}
                        p={3}
                        rounded="xl"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="gray.50"
                        cursor="pointer"
                        _hover={{ bg: `${templatesFiltrados[categoriaAtiva].cor}.50`, borderColor: `${templatesFiltrados[categoriaAtiva].cor}.300` }}
                        transition="all 0.15s"
                        userSelect="none"
                      >
                        <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>{tpl.titulo}</Text>
                        <Text fontSize="xs" color="gray.400" noOfLines={2} whiteSpace="pre-line">{tpl.texto}</Text>
                      </Box>
                    ))}
                  </VStack>
                )}
              </>
            )}
            <Divider mt={4} mb={1} />
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Clique em um template para preencher a mensagem automaticamente. Você pode editar antes de enviar.
            </Text>
          </Box>
        )}
      </Box>

      {/* Textarea */}
      <FormControl mb={4}>
        <HStack justify="space-between" mb={1}>
          <FormLabel fontSize="sm" color="gray.600" fontWeight="600" mb={0}>Mensagem</FormLabel>
          {mensagem && (
            <Button size="xs" variant="ghost" color="gray.400" onClick={() => { setMensagem(''); setRawTemplate(null) }} _hover={{ color: 'red.500' }}>
              Limpar
            </Button>
          )}
        </HStack>
        <Textarea
          ref={textareaRef}
          placeholder={'Digite sua mensagem ou escolha um template acima...\n\nLembre-se de substituir os campos entre {chaves} pelos dados reais.'}
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
        onClick={onSend}
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
  )
}
