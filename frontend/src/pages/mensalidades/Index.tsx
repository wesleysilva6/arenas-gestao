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
import { FiBell, FiRefreshCw, FiSearch, FiZap } from 'react-icons/fi'

import {
  listarMensalidades,
  confirmarPagamento,
  gerarMesAtual,
  contarSemMensalidade,
  getMesReferenciaAtual,
  formatMesReferencia,
  type Mensalidade,
} from '../../service/mensalidades'

import ResumoCards from './components/ResumoCards'
import TabelaMensalidades from './components/TabelaMensalidades'
import ConfirmarPagamento from './components/ConfirmarPagamento'

export default function MensalidadesPage() {
  const toast = useToast()
  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [semMensalidade, setSemMensalidade] = useState(0)
  const [search, setSearch] = useState('')
  const [filtroSituacao, setFiltroSituacao] = useState('')
  const [filtroMes, setFiltroMes] = useState('')
  const [mensalidadeSelecionada, setMensalidadeSelecionada] = useState<Mensalidade | null>(null)

  const modalConfirmar = useDisclosure()
  const mesAtual = getMesReferenciaAtual()

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listarMensalidades()
      setMensalidades(data)
    } catch (err: any) {
      toast({ title: 'Erro ao carregar mensalidades', description: err.message, status: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const carregarSemMensalidade = useCallback(async () => {
    try {
      const total = await contarSemMensalidade(mesAtual)
      setSemMensalidade(total)
    } catch {
      // silencioso
    }
  }, [mesAtual])

  useEffect(() => {
    carregarDados()
    carregarSemMensalidade()
  }, [carregarDados, carregarSemMensalidade])

  const filtered = mensalidades.filter((m) => {
    const matchSearch =
      !search ||
      m.aluno_nome.toLowerCase().includes(search.toLowerCase()) ||
      formatMesReferencia(m.mes_referencia).toLowerCase().includes(search.toLowerCase())
    const matchSituacao = !filtroSituacao || m.situacao === Number(filtroSituacao)
    const matchMes = !filtroMes || m.mes_referencia === filtroMes
    return matchSearch && matchSituacao && matchMes
  })

  const totalPendentes = mensalidades.filter((m) => m.situacao === 0).length
  const totalAtrasadas = mensalidades.filter((m) => m.situacao === 2).length
  const totalPagas = mensalidades.filter((m) => m.situacao === 1).length
  const valorPendentes = mensalidades.filter((m) => m.situacao === 0).reduce((s, m) => s + m.valor, 0)
  const valorAtrasadas = mensalidades.filter((m) => m.situacao === 2).reduce((s, m) => s + m.valor, 0)
  const valorPagas = mensalidades.filter((m) => m.situacao === 1).reduce((s, m) => s + m.valor, 0)
  const valorMesAtual = mensalidades.filter((m) => m.mes_referencia === mesAtual).reduce((s, m) => s + m.valor, 0)

  const mesesUnicos = [...new Set(mensalidades.map((m) => m.mes_referencia))].sort().reverse()

  function handleConfirmarPagamento(m: Mensalidade) {
    setMensalidadeSelecionada(m)
    modalConfirmar.onOpen()
  }

  async function handleGerarMes() {
    try {
      setGerando(true)
      const result = await gerarMesAtual(mesAtual)
      toast({
        title: result.message,
        status: result.geradas > 0 ? 'success' : 'info',
        duration: 4000,
        position: 'top-right',
      })
      await carregarDados()
      await carregarSemMensalidade()
    } catch (err: any) {
      toast({ title: 'Erro ao gerar mensalidades', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setGerando(false)
    }
  }

  async function handleConfirmar() {
    if (!mensalidadeSelecionada) return
    try {
      setConfirmando(true)
      await confirmarPagamento(mensalidadeSelecionada.idmensalidade)
      toast({ title: 'Pagamento confirmado!', status: 'success', duration: 3000, position: 'top-right' })
      modalConfirmar.onClose()
      await carregarDados()
    } catch (err: any) {
      toast({ title: 'Erro ao confirmar pagamento', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      {/* Banner: alunos sem mensalidade */}
      {semMensalidade > 0 && (
        <Flex
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
          rounded="2xl"
          px={5}
          py={4}
          mb={5}
          align="center"
          justify="space-between"
          gap={4}
          wrap="wrap"
        >
          <HStack spacing={3}>
            <Flex w={9} h={9} rounded="xl" bg="orange.100" align="center" justify="center" flexShrink={0}>
              <Icon as={FiBell} boxSize={5} color="orange.500" />
            </Flex>
            <Box>
              <Text fontSize="sm" fontWeight="700" color="orange.700">
                {semMensalidade} aluno{semMensalidade !== 1 ? 's' : ''} sem mensalidade em {formatMesReferencia(mesAtual)}
              </Text>
              <Text fontSize="xs" color="orange.500">
                Clique em "Gerar Mês Atual" para criar as mensalidades pendentes.
              </Text>
            </Box>
          </HStack>
          <Button
            size="sm"
            colorScheme="orange"
            rounded="xl"
            leftIcon={<FiZap />}
            onClick={handleGerarMes}
            isLoading={gerando}
            loadingText="Gerando..."
          >
            Gerar Agora
          </Button>
        </Flex>
      )}

      {/* Cards de resumo */}
      <ResumoCards
        valorPendentes={valorPendentes}
        valorAtrasadas={valorAtrasadas}
        valorPagas={valorPagas}
        valorMesAtual={valorMesAtual}
        totalPendentes={totalPendentes}
        totalAtrasadas={totalAtrasadas}
        totalPagas={totalPagas}
        mesAtual={mesAtual}
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
          <InputGroup maxW={{ md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por aluno ou mês..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rounded="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
            />
          </InputGroup>

          <Select
            placeholder="Todos os status"
            value={filtroSituacao}
            onChange={(e) => setFiltroSituacao(e.target.value)}
            maxW="180px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            display={{ base: 'none', md: 'block' }}
          >
            <option value="0">Pendentes</option>
            <option value="2">Atrasadas</option>
            <option value="1">Pagas</option>
          </Select>

          <Select
            placeholder="Todos os meses"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            maxW="200px"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            display={{ base: 'none', md: 'block' }}
          >
            {mesesUnicos.map((mes) => (
              <option key={mes} value={mes}>
                {formatMesReferencia(mes)}
              </option>
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
              onClick={() => carregarDados()}
            />
          </Tooltip>
          <Button
            leftIcon={<FiZap />}
            colorScheme="brand"
            rounded="xl"
            onClick={handleGerarMes}
            isLoading={gerando}
            loadingText="Gerando..."
            px={5}
          >
            Gerar Mês Atual
          </Button>
        </HStack>
      </Flex>

      {/* Tabela */}
      <TabelaMensalidades
        mensalidades={filtered}
        loading={loading}
        onConfirmarPagamento={handleConfirmarPagamento}
      />

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <Flex px={2} pt={3} justify="flex-start">
          <Text fontSize="xs" color="gray.400">
            Exibindo {filtered.length} de {mensalidades.length} mensalidade{mensalidades.length !== 1 ? 's' : ''}
          </Text>
        </Flex>
      )}

      {/* Modal confirmar pagamento */}
      <ConfirmarPagamento
        isOpen={modalConfirmar.isOpen}
        onClose={modalConfirmar.onClose}
        onConfirmar={handleConfirmar}
        mensalidade={mensalidadeSelecionada}
        confirmando={confirmando}
      />
    </Box>
  )
}
