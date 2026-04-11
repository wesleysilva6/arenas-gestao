import { useEffect, useState } from 'react'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiPlus, FiSearch, FiTrash2, FiUsers } from 'react-icons/fi'
import {
  listarAlunosDaTurma,
  listarAlunosDisponiveisDaTurma,
  adicionarAlunoTurma,
  removerAlunoTurma,
  type AlunoSimples,
  type Turma,
} from '../../../service/turmas'

interface Props {
  isOpen: boolean
  onClose: () => void
  turma: Turma | null
  onChanged?: () => void  // callback to refresh turma counts
}

export default function ModalAlunosTurma({ isOpen, onClose, turma, onChanged }: Props) {
  const toast = useToast()
  const [alunos, setAlunos] = useState<AlunoSimples[]>([])
  const [loading, setLoading] = useState(false)
  const [disponiveis, setDisponiveis] = useState<AlunoSimples[]>([])
  const [loadingDisponiveis, setLoadingDisponiveis] = useState(false)
  const [search, setSearch] = useState('')
  const [adicionando, setAdicionando] = useState<number | null>(null)
  const [removendo, setRemovendo] = useState<number | null>(null)
  const [modoAdicionar, setModoAdicionar] = useState(false)

  useEffect(() => {
    if (isOpen && turma) {
      setModoAdicionar(false)
      setSearch('')
      carregarAlunos()
    }
  }, [isOpen, turma])

  async function carregarAlunos() {
    if (!turma) return
    setLoading(true)
    try {
      const data = await listarAlunosDaTurma(turma.idturma)
      setAlunos(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar alunos', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  async function abrirModoAdicionar() {
    if (!turma) return
    setModoAdicionar(true)
    setSearch('')
    setLoadingDisponiveis(true)
    try {
      const data = await listarAlunosDisponiveisDaTurma(turma.idturma)
      setDisponiveis(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar alunos disponíveis', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setLoadingDisponiveis(false)
    }
  }

  async function handleAdicionar(aluno: AlunoSimples) {
    if (!turma) return
    setAdicionando(aluno.idaluno)
    try {
      await adicionarAlunoTurma(turma.idturma, aluno.idaluno)
      toast({ title: `${aluno.nome} adicionado à turma`, status: 'success', duration: 2500, position: 'top-right' })
      // move aluno from disponiveis to alunos list
      setDisponiveis((prev) => prev.filter((a) => a.idaluno !== aluno.idaluno))
      setAlunos((prev) => [...prev, aluno].sort((a, b) => a.nome.localeCompare(b.nome)))
      onChanged?.()
    } catch (err: any) {
      toast({ title: 'Erro ao adicionar aluno', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setAdicionando(null)
    }
  }

  async function handleRemover(aluno: AlunoSimples) {
    if (!turma) return
    setRemovendo(aluno.idaluno)
    try {
      await removerAlunoTurma(turma.idturma, aluno.idaluno)
      toast({ title: `${aluno.nome} removido da turma`, status: 'info', duration: 2500, position: 'top-right' })
      setAlunos((prev) => prev.filter((a) => a.idaluno !== aluno.idaluno))
      // if add panel is open, put them back in disponíveis
      if (modoAdicionar) {
        setDisponiveis((prev) => [...prev, aluno].sort((a, b) => a.nome.localeCompare(b.nome)))
      }
      onChanged?.()
    } catch (err: any) {
      toast({ title: 'Erro ao remover aluno', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setRemovendo(null)
    }
  }

  const filteredDisponiveis = disponiveis.filter((a) =>
    !search || a.nome.toLowerCase().includes(search.toLowerCase()) || a.telefone.includes(search)
  )

  const limiteAtingido = turma?.limite_alunos != null && alunos.length >= turma.limite_alunos

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4} maxH="85vh">
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800" pb={1}>
          {turma?.nome}
          {!loading && (
            <Text as="span" fontSize="sm" fontWeight="400" color="gray.400" ml={2}>
              · {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
              {turma?.limite_alunos ? ` / ${turma.limite_alunos}` : ''}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton rounded="xl" />

        <ModalBody pb={2} px={5}>
          {/* Alunos na turma */}
          {loading ? (
            <VStack spacing={3} py={2}>
              {[1, 2, 3].map((i) => <Skeleton key={i} h="56px" w="full" rounded="xl" />)}
            </VStack>
          ) : alunos.length === 0 ? (
            <Flex direction="column" align="center" py={8} gap={2}>
              <Flex w={12} h={12} rounded="2xl" bg="gray.50" align="center" justify="center">
                <Icon as={FiUsers} boxSize={5} color="gray.300" />
              </Flex>
              <Text fontSize="sm" fontWeight="600" color="gray.400">
                Nenhum aluno nesta turma
              </Text>
            </Flex>
          ) : (
            <VStack spacing={0} divider={<Divider borderColor="gray.50" />}>
              {alunos.map((a) => (
                <Flex key={a.idaluno} w="full" align="center" gap={3} py={3}>
                  <Avatar size="sm" name={a.nome} bg="brand.500" color="white" fontWeight="600" />
                  <Box flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="600" color="gray.800" noOfLines={1}>{a.nome}</Text>
                    <Text fontSize="xs" color="gray.400">{a.telefone || '—'}</Text>
                  </Box>
                  <Badge
                    colorScheme={a.situacao === 1 ? 'green' : 'gray'}
                    rounded="full" px={2} fontSize="xs" fontWeight="600"
                  >
                    {a.situacao === 1 ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Tooltip label="Remover da turma">
                    <IconButton
                      aria-label="Remover"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      rounded="lg"
                      isLoading={removendo === a.idaluno}
                      onClick={() => handleRemover(a)}
                    />
                  </Tooltip>
                </Flex>
              ))}
            </VStack>
          )}

          {/* Painel de adicionar alunos */}
          {modoAdicionar && (
            <Box mt={4} pt={4} borderTop="2px dashed" borderColor="brand.100">
              <Text fontSize="sm" fontWeight="700" color="brand.600" mb={3}>
                Adicionar aluno à turma
                {limiteAtingido && (
                  <Text as="span" fontSize="xs" color="orange.500" fontWeight="500" ml={2}>
                    (limite atingido)
                  </Text>
                )}
              </Text>
              <InputGroup mb={3}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" boxSize={4} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar aluno pelo nome ou telefone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="sm"
                  rounded="xl"
                  bg="gray.50"
                />
              </InputGroup>

              {loadingDisponiveis ? (
                <VStack spacing={2}>
                  {[1, 2, 3].map((i) => <Skeleton key={i} h="44px" w="full" rounded="lg" />)}
                </VStack>
              ) : filteredDisponiveis.length === 0 ? (
                <Flex py={6} direction="column" align="center" gap={1}>
                  <Icon as={FiUsers} boxSize={6} color="gray.300" />
                  <Text fontSize="sm" color="gray.400">
                    {search ? 'Nenhum aluno encontrado' : 'Todos os alunos ativos já estão nesta turma'}
                  </Text>
                </Flex>
              ) : (
                <VStack spacing={0} maxH="220px" overflowY="auto" divider={<Divider borderColor="gray.50" />}>
                  {filteredDisponiveis.map((a) => (
                    <Flex key={a.idaluno} w="full" align="center" gap={3} py={2.5}>
                      <Avatar size="xs" name={a.nome} bg="gray.400" color="white" fontWeight="600" />
                      <Box flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="600" color="gray.700" noOfLines={1}>{a.nome}</Text>
                        <Text fontSize="xs" color="gray.400">{a.telefone || '—'}</Text>
                      </Box>
                      <Tooltip label={limiteAtingido ? 'Limite de alunos atingido' : 'Adicionar à turma'}>
                        <IconButton
                          aria-label="Adicionar"
                          icon={<FiPlus />}
                          size="sm"
                          colorScheme="brand"
                          variant="ghost"
                          rounded="lg"
                          isLoading={adicionando === a.idaluno}
                          isDisabled={limiteAtingido}
                          onClick={() => handleAdicionar(a)}
                        />
                      </Tooltip>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          )}
        </ModalBody>

        <ModalFooter pt={3} pb={4} gap={2} borderTop="1px solid" borderColor="gray.50">
          {modoAdicionar ? (
            <Button variant="ghost" rounded="xl" size="sm" onClick={() => { setModoAdicionar(false); setSearch('') }}>
              Fechar painel
            </Button>
          ) : (
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              variant="outline"
              rounded="xl"
              size="sm"
              onClick={abrirModoAdicionar}
            >
              Adicionar Aluno
            </Button>
          )}
          <Button variant="ghost" rounded="xl" size="sm" onClick={onClose} ml="auto">
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

