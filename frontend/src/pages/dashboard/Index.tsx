import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Avatar,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Skeleton,
} from '@chakra-ui/react'
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiAlertTriangle,
  FiLayers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi'

import { formatCurrency, formatDate } from '../../utils/formatters'
import type { Vencimento, Treino, StatCard } from '../../utils/types'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [proximosVencimentos, setProximosVencimentos] = useState<Vencimento[]>([])
  const [treinosHoje, setTreinosHoje] = useState<Treino[]>([])

  // Stats montados a partir dos dados carregados da API
  const statCards: StatCard[] = [
    { label: 'Total de Alunos',     value: '-', icon: FiUsers,        color: 'brand.500', bg: 'brand.50'  },
    { label: 'Treinos Hoje',        value: '-', icon: FiCalendar,     color: 'green.500', bg: 'green.50'  },
    { label: 'Receita do Mês',      value: '-', icon: FiDollarSign,   color: 'teal.500',  bg: 'teal.50'   },
    { label: 'Vencimentos',         value: '-', icon: FiAlertTriangle,color: 'orange.500',bg: 'orange.50' },
    { label: 'Modalidades Ativas',  value: '-', icon: FiLayers,       color: 'purple.500',bg: 'purple.50' },
    { label: 'Crescimento',         value: '-', icon: FiTrendingUp,   color: 'cyan.500',  bg: 'cyan.50'   },
  ]

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        // TODO: substituir pelas chamadas do service quando a API estiver pronta
        // const vencimentos = await dashboardService.listarVencimentos()
        // const treinos = await dashboardService.listarTreinosHoje()
        // setProximosVencimentos(vencimentos)
        // setTreinosHoje(treinos)
        setProximosVencimentos([])
        setTreinosHoje([])
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5} mb={8}>
          {statCards.map((card) => (
            <Box
              key={card.label}
              bg={card.bg}
              rounded="2xl"
              p={5}
              border="1px solid"
              borderColor="blackAlpha.50"
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                    {card.label}
                  </Text>
                  <Skeleton isLoaded={!loading} mt={2}>
                    <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                      {card.value}
                    </Text>
                  </Skeleton>
                </Box>
                <Flex
                  w={10}
                  h={10}
                  rounded="xl"
                  bg="white"
                  align="center"
                  justify="center"
                  shadow="sm"
                >
                  <Icon as={card.icon} boxSize={5} color={card.color} />
                </Flex>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>

        {/* Bottom Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Próximos Vencimentos */}
          <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
            <Flex
              px={6}
              py={4}
              borderBottom="1px solid"
              borderColor="gray.100"
              align="center"
              justify="space-between"
            >
              <HStack spacing={2}>
                <Icon as={FiDollarSign} color="brand.500" />
                <Heading size="sm" color="gray.700">
                  Próximos Vencimentos
                </Heading>
              </HStack>
              <Badge colorScheme="orange" rounded="full" px={2} fontSize="xs">
                {proximosVencimentos.length}
              </Badge>
            </Flex>

            {loading ? (
              <VStack p={6} spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} h="40px" w="full" rounded="lg" />
                ))}
              </VStack>
            ) : proximosVencimentos.length === 0 ? (
              <Flex p={8} justify="center" align="center" direction="column">
                <Icon as={FiCheckCircle} boxSize={10} color="palm.400" mb={3} />
                <Text color="gray.400" fontSize="sm">
                  Nenhum vencimento pendente
                </Text>
              </Flex>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th color="gray.400" fontSize="xs">Aluno</Th>
                    <Th color="gray.400" fontSize="xs">Vencimento</Th>
                    <Th color="gray.400" fontSize="xs" isNumeric>Valor</Th>
                    <Th color="gray.400" fontSize="xs">Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {proximosVencimentos.map((v, i) => (
                    <Tr key={i} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <HStack spacing={2}>
                          <Avatar size="xs" name={v.aluno} bg="brand.100" color="brand.700" />
                          <Text fontSize="sm" fontWeight="500" color="gray.700">
                            {v.aluno}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {formatDate(v.vencimento)}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                          {formatCurrency(v.valor)}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={v.situacao === 2 ? 'red' : 'yellow'}
                          rounded="full"
                          px={2}
                          fontSize="xs"
                        >
                          {v.situacao === 2 ? 'Vencido' : 'Pendente'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>

          {/* Treinos de Hoje */}
          <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
            <Flex
              px={6}
              py={4}
              borderBottom="1px solid"
              borderColor="gray.100"
              align="center"
              justify="space-between"
            >
              <HStack spacing={2}>
                <Icon as={FiCalendar} color="brand.500" />
                <Heading size="sm" color="gray.700">
                  Treinos de Hoje
                </Heading>
              </HStack>
              <Badge colorScheme="green" rounded="full" px={2} fontSize="xs">
                {treinosHoje.length}
              </Badge>
            </Flex>

            {loading ? (
              <VStack p={6} spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} h="60px" w="full" rounded="lg" />
                ))}
              </VStack>
            ) : treinosHoje.length === 0 ? (
              <Flex p={8} justify="center" align="center" direction="column">
                <Icon as={FiCalendar} boxSize={10} color="gray.300" mb={3} />
                <Text color="gray.400" fontSize="sm">
                  Nenhum treino agendado para hoje
                </Text>
              </Flex>
            ) : (
              <VStack spacing={0} divider={<Box borderBottom="1px solid" borderColor="gray.50" />}>
                {treinosHoje.map((t, i) => (
                  <Flex
                    key={i}
                    w="full"
                    px={6}
                    py={4}
                    align="center"
                    justify="space-between"
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.15s"
                  >
                    <HStack spacing={3}>
                      <Flex
                        w={10}
                        h={10}
                        rounded="xl"
                        bg="brand.50"
                        align="center"
                        justify="center"
                      >
                        <Icon as={FiClock} color="brand.500" />
                      </Flex>
                      <Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.700">
                          {t.turma}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {t.modalidade}
                        </Text>
                      </Box>
                    </HStack>
                    <VStack spacing={0} align="end">
                      <Text fontSize="sm" fontWeight="600" color="brand.600">
                        {t.horario}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {t.alunos} aluno{t.alunos !== 1 ? 's' : ''}
                      </Text>
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            )}
          </Box>
        </SimpleGrid>
      </Box>
  );
}