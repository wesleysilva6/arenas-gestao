import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { FiDollarSign, FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi'

import {
  listarGastos,
  cadastrarGasto,
  editarGasto,
  deletarGasto,
  resumoMes,
  getMesAtual,
  formatMes,
  CATEGORIAS,
  type Gasto,
} from '../../service/gastos'

import ResumoCards from './components/ResumoCards'
import TabelaGastos from './components/TabelaGastos'
import FormGasto from './components/FormGasto'
import ConfirmarExclusao from './components/ConfirmarExclusao'

export default function GastosPage() {
  const toast = useToast()
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMes, setFiltroMes] = useState('')
  const [totalMes, setTotalMes] = useState(0)
  const [quantidadeMes, setQuantidadeMes] = useState(0)

  const [gastoEditando, setGastoEditando] = useState<Gasto | null>(null)
  const [gastoDeletando, setGastoDeletando] = useState<Gasto | null>(null)

  const modalForm = useDisclosure()
  const modalExclusao = useDisclosure()

  const mesAtual = getMesAtual()

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listarGastos()
      setGastos(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar gastos', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const carregarResumo = useCallback(async () => {
    try {
      const mes = filtroMes || mesAtual
      const data = await resumoMes(mes)
      const total = data.reduce((s: number, r: any) => s + Number(r.total), 0)
      const qtd = data.reduce((s: number, r: any) => s + Number(r.quantidade), 0)
      setTotalMes(total)
      setQuantidadeMes(qtd)
    } catch {
      setTotalMes(0)
      setQuantidadeMes(0)
    }
  }, [filtroMes, mesAtual])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  useEffect(() => {
    carregarResumo()
  }, [carregarResumo])

  // Meses únicos disponíveis
  const mesesUnicos = [...new Set(gastos.map((g) => g.data.slice(0, 7)))].sort().reverse()

  // Filtros
  const filtered = gastos.filter((g) => {
    const matchSearch =
      !search ||
      g.descricao.toLowerCase().includes(search.toLowerCase()) ||
      g.categoria.toLowerCase().includes(search.toLowerCase()) ||
      (g.observacao ?? '').toLowerCase().includes(search.toLowerCase())
    const matchCategoria = !filtroCategoria || g.categoria === filtroCategoria
    const matchMes = !filtroMes || g.data.startsWith(filtroMes)
    return matchSearch && matchCategoria && matchMes
  })

  // Total geral
  const totalGeral = gastos.reduce((s, g) => s + g.valor, 0)

  const mesLabel = formatMes(filtroMes || mesAtual)

  function handleNovo() {
    setGastoEditando(null)
    modalForm.onOpen()
  }

  function handleEditar(g: Gasto) {
    setGastoEditando(g)
    modalForm.onOpen()
  }

  function handleDeletar(g: Gasto) {
    setGastoDeletando(g)
    modalExclusao.onOpen()
  }

  async function handleSalvar(dados: { descricao: string; valor: number; categoria: string; data: string; observacao: string | null }) {
    try {
      setSalvando(true)
      if (gastoEditando) {
        await editarGasto(gastoEditando.idgasto, dados)
        toast({ title: 'Gasto atualizado!', status: 'success', duration: 3000, position: 'top-right' })
      } else {
        await cadastrarGasto(dados)
        toast({ title: 'Gasto cadastrado!', status: 'success', duration: 3000, position: 'top-right' })
      }
      modalForm.onClose()
      await carregarDados()
      await carregarResumo()
    } catch (err: any) {
      toast({ title: 'Erro ao salvar gasto', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarExclusao() {
    if (!gastoDeletando) return
    try {
      setDeletando(true)
      await deletarGasto(gastoDeletando.idgasto)
      toast({ title: 'Gasto excluído!', status: 'success', duration: 3000, position: 'top-right' })
      modalExclusao.onClose()
      await carregarDados()
      await carregarResumo()
    } catch (err: any) {
      toast({ title: 'Erro ao excluir gasto', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setDeletando(false)
    }
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      {/* Header */}
      <Flex mb={6} align="center" gap={3}>
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
          <Icon as={FiDollarSign} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.800">
            Gastos
          </Text>
          <Text fontSize="xs" color="gray.400">
            Controle de despesas da arena
          </Text>
        </Box>
      </Flex>

      {/* Cards de resumo */}
      <ResumoCards
        totalMes={totalMes}
        totalGeral={totalGeral}
        quantidadeMes={quantidadeMes}
        mesLabel={mesLabel}
        loading={loading}
      />

      {/* Toolbar */}
      <Flex
        bg="white"
        rounded="2xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        p={4}
        mb={5}
        gap={3}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
      >
        <HStack spacing={3} flex={1}>
          <InputGroup maxW={{ md: '280px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar gastos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rounded="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
            />
          </InputGroup>

          <Select
            placeholder="Todas categorias"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            maxW="200px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
            display={{ base: 'none', md: 'block' }}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          <Select
            placeholder="Todos os meses"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            maxW="180px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
            display={{ base: 'none', md: 'block' }}
          >
            {mesesUnicos.map((mes) => (
              <option key={mes} value={mes}>{formatMes(mes)}</option>
            ))}
          </Select>
        </HStack>

        <HStack spacing={2}>
          <Tooltip label="Atualizar">
            <IconButton
              aria-label="Atualizar"
              icon={<FiRefreshCw />}
              variant="ghost"
              rounded="xl"
              color="gray.500"
              onClick={() => { carregarDados(); carregarResumo() }}
            />
          </Tooltip>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            rounded="xl"
            onClick={handleNovo}
            px={5}
          >
            Novo Gasto
          </Button>
        </HStack>
      </Flex>

      {/* Tabela */}
      <TabelaGastos
        gastos={filtered}
        loading={loading}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />

      {/* Footer */}
      {!loading && filtered.length > 0 && (
        <Flex px={2} pt={3} justify="flex-start">
          <Text fontSize="xs" color="gray.400">
            Exibindo {filtered.length} de {gastos.length} gasto{gastos.length !== 1 ? 's' : ''}
          </Text>
        </Flex>
      )}

      {/* Modal Form */}
      <FormGasto
        isOpen={modalForm.isOpen}
        onClose={modalForm.onClose}
        gasto={gastoEditando}
        saving={salvando}
        onSalvar={handleSalvar}
      />

      {/* Dialog Exclusão */}
      <ConfirmarExclusao
        isOpen={modalExclusao.isOpen}
        onClose={modalExclusao.onClose}
        gasto={gastoDeletando}
        deletando={deletando}
        onConfirmar={handleConfirmarExclusao}
      />
    </Box>
  )
}
