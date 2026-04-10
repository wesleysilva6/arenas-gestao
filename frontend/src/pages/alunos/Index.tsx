import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiPlus, FiSearch, FiUsers } from 'react-icons/fi'

import {
  listarAlunos,
  cadastrarAluno,
  editarAluno,
  deletarAluno,
  cancelarAluno,
  listarModalidades,
  type Aluno,
  type Modalidade,
} from '../../service/alunos'

import TabelaAlunos from './components/TabelaAlunos'
import ModalAluno from './components/ModalAluno'
import ConfirmarExclusao from './components/ConfirmarExclusao'
import ConfirmarCancelamento from './components/ConfirmarCancelamento'

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [busca, setBusca] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null)

  const modalForm = useDisclosure()
  const modalExclusao = useDisclosure()
  const modalCancelamento = useDisclosure()
  const toast = useToast()

  async function carregarDados() {
    try {
      setLoading(true)
      const [alunosData, modalidadesData] = await Promise.all([
        listarAlunos(),
        listarModalidades(),
      ])
      setAlunos(alunosData)
      setModalidades(modalidadesData)
    } catch (err) {
      console.error('Erro ao carregar alunos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const alunosFiltrados = alunos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.telefone.includes(busca) ||
    a.modalidade_nome.toLowerCase().includes(busca.toLowerCase())
  )

  function handleNovo() {
    setAlunoSelecionado(null)
    modalForm.onOpen()
  }

  function handleEditar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalForm.onOpen()
  }

  function handleDeletar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalExclusao.onOpen()
  }

  function handleCancelar(aluno: Aluno) {
    setAlunoSelecionado(aluno)
    modalCancelamento.onOpen()
  }

  async function handleConfirmarCancelamento() {
    if (!alunoSelecionado) return
    try {
      setCancelando(true)
      await cancelarAluno(alunoSelecionado.idaluno)
      toast({ title: 'Aluno cancelado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      modalCancelamento.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao cancelar', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setCancelando(false)
    }
  }

  async function handleSalvar(dados: Partial<Aluno>) {
    try {
      setSalvando(true)

      if (alunoSelecionado) {
        await editarAluno(alunoSelecionado.idaluno, dados)
        toast({ title: 'Aluno atualizado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarAluno(dados)
        toast({ title: 'Aluno cadastrado com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      }

      modalForm.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarExclusao() {
    if (!alunoSelecionado) return
    try {
      setDeletando(true)
      await deletarAluno(alunoSelecionado.idaluno)
      toast({ title: 'Aluno removido com sucesso!', status: 'success', duration: 3000, position: 'top-right' })
      modalExclusao.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao remover', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setDeletando(false)
    }
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <HStack spacing={3}>
          <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
            <Icon as={FiUsers} boxSize={5} color="brand.500" />
          </Flex>
          <Heading size="lg" color="gray.800" fontWeight="700">
            Alunos
          </Heading>
        </HStack>

        <HStack spacing={3}>
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              bg="white"
              rounded="xl"
              border="1px solid"
              borderColor="gray.200"
            />
          </InputGroup>

          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            rounded="xl"
            onClick={handleNovo}
            px={6}
          >
            Novo Aluno
          </Button>
        </HStack>
      </Flex>

      {/* Tabela */}
      <TabelaAlunos
        alunos={alunosFiltrados}
        loading={loading}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
        onCancelar={handleCancelar}
      />

      {/* Modal Formulário */}
      <ModalAluno
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        onSalvar={handleSalvar}
        aluno={alunoSelecionado}
        modalidades={modalidades}
        salvando={salvando}
      />

      {/* Modal Exclusão */}
      <ConfirmarExclusao
        isOpen={modalExclusao.isOpen}
        onClose={modalExclusao.onClose}
        onConfirmar={handleConfirmarExclusao}
        aluno={alunoSelecionado}
        deletando={deletando}
      />

      {/* Modal Cancelamento */}
      <ConfirmarCancelamento
        isOpen={modalCancelamento.isOpen}
        onClose={modalCancelamento.onClose}
        onConfirmar={handleConfirmarCancelamento}
        aluno={alunoSelecionado}
        cancelando={cancelando}
      />
    </Box>
  )
}
