import { useMemo } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { FiAlertTriangle, FiCalendar, FiCheck, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi'
import type { Mensalidade } from '../../../service/mensalidades'
import { formatMesReferencia } from '../../../service/mensalidades'

interface Props {
  mensalidades: Mensalidade[]
  loading: boolean
  onConfirmarPagamento: (m: Mensalidade) => void
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

function situacaoInfo(s: number) {
  switch (s) {
    case 0: return { label: 'Pendente', color: 'yellow', icon: FiClock }
    case 1: return { label: 'Pago', color: 'green', icon: FiCheckCircle }
    case 2: return { label: 'Atrasada', color: 'red', icon: FiAlertTriangle }
    default: return { label: 'Desconhecido', color: 'gray', icon: FiClock }
  }
}

export default function TabelaMensalidades({ mensalidades, loading, onConfirmarPagamento }: Props) {
  const grupos = useMemo(() => {
    const map = new Map<number, { aluno_id: number; aluno_nome: string; items: Mensalidade[] }>()
    for (const m of mensalidades) {
      if (!map.has(m.aluno_id)) {
        map.set(m.aluno_id, { aluno_id: m.aluno_id, aluno_nome: m.aluno_nome, items: [] })
      }
      map.get(m.aluno_id)!.items.push(m)
    }
    return [...map.values()]
      .sort((a, b) => a.aluno_nome.localeCompare(b.aluno_nome))
      .map((g) => ({
        ...g,
        items: [...g.items].sort((a, b) => a.mes_referencia.localeCompare(b.mes_referencia)),
      }))
  }, [mensalidades])

  if (loading) {
    return (
      <VStack spacing={3} align="stretch">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} h="68px" w="full" rounded="2xl" />
        ))}
      </VStack>
    )
  }

  if (mensalidades.length === 0) {
    return (
      <Flex
        bg="white"
        rounded="2xl"
        shadow="sm"
        border="1px solid"
        borderColor="gray.100"
        p={12}
        justify="center"
        align="center"
        direction="column"
        gap={2}
      >
        <Icon as={FiDollarSign} boxSize={12} color="gray.300" />
        <Text color="gray.400" fontSize="md" fontWeight="500">
          Nenhuma mensalidade encontrada
        </Text>
      </Flex>
    )
  }

  return (
    <Accordion allowMultiple>
      <VStack spacing={3} align="stretch">
        {grupos.map((grupo) => {
          const pendentes = grupo.items.filter((m) => m.situacao === 0).length
          const atrasadas = grupo.items.filter((m) => m.situacao === 2).length
          const pagas = grupo.items.filter((m) => m.situacao === 1).length
          const totalAberto = grupo.items
            .filter((m) => m.situacao !== 1)
            .reduce((s, m) => s + m.valor, 0)

          return (
            <AccordionItem
              key={grupo.aluno_id}
              bg="white"
              rounded="2xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <AccordionButton px={5} py={4} _hover={{ bg: 'gray.50' }}>
                <HStack flex="1" spacing={4} minW={0}>
                  <Avatar size="sm" name={grupo.aluno_nome} bg="brand.100" color="brand.700" flexShrink={0} />
                  <Box textAlign="left" minW={0}>
                    <Text fontWeight="700" fontSize="sm" color="gray.800" isTruncated>
                      {grupo.aluno_nome}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {grupo.items.length} parcela{grupo.items.length !== 1 ? 's' : ''}
                    </Text>
                  </Box>
                  <HStack spacing={2} ml="auto" mr={3} flexShrink={0} flexWrap="wrap" justify="flex-end">
                    {atrasadas > 0 && (
                      <Badge colorScheme="red" rounded="full" fontSize="xs">
                        {atrasadas} atrasada{atrasadas !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {pendentes > 0 && (
                      <Badge colorScheme="yellow" rounded="full" fontSize="xs">
                        {pendentes} pendente{pendentes !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {pagas > 0 && (
                      <Badge colorScheme="green" rounded="full" fontSize="xs">
                        {pagas} paga{pagas !== 1 ? 's' : ''}
                      </Badge>
                    )}
                    {totalAberto > 0 && (
                      <Text fontSize="sm" fontWeight="700" color="gray.600" display={{ base: 'none', md: 'block' }}>
                        {formatCurrency(totalAberto)} em aberto
                      </Text>
                    )}
                  </HStack>
                </HStack>
                <AccordionIcon color="gray.400" />
              </AccordionButton>

              <AccordionPanel p={0}>
                <Box overflowX="auto" borderTop="1px solid" borderColor="gray.100">
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th color="gray.500" fontSize="xs" py={3}>Mês Ref.</Th>
                        <Th color="gray.500" fontSize="xs" py={3}>Valor</Th>
                        <Th color="gray.500" fontSize="xs" py={3} display={{ base: 'none', md: 'table-cell' }}>Vencimento</Th>
                        <Th color="gray.500" fontSize="xs" py={3} display={{ base: 'none', md: 'table-cell' }}>Pagamento</Th>
                        <Th color="gray.500" fontSize="xs" py={3}>Status</Th>
                        <Th color="gray.500" fontSize="xs" py={3} textAlign="center">Ação</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {grupo.items.map((m) => {
                        const st = situacaoInfo(m.situacao)
                        return (
                          <Tr key={m.idmensalidade} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                            <Td py={3}>
                              <Badge colorScheme="purple" variant="subtle" rounded="full" px={2} fontSize="xs">
                                {formatMesReferencia(m.mes_referencia)}
                              </Badge>
                            </Td>
                            <Td py={3}>
                              <Text fontSize="sm" fontWeight="700" color="gray.700">
                                {formatCurrency(m.valor)}
                              </Text>
                            </Td>
                            <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                              <HStack spacing={1}>
                                <Icon as={FiCalendar} boxSize={3} color="gray.400" />
                                <Text fontSize="sm" color="gray.600">{formatDate(m.data_vencimento)}</Text>
                              </HStack>
                            </Td>
                            <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                              <Text fontSize="sm" color="gray.600">{formatDate(m.data_pagamento)}</Text>
                            </Td>
                            <Td py={3}>
                              <Badge
                                colorScheme={st.color}
                                rounded="full"
                                px={2.5}
                                py={0.5}
                                fontSize="xs"
                                fontWeight="600"
                              >
                                <HStack spacing={1}>
                                  <Icon as={st.icon} boxSize={3} />
                                  <Text>{st.label}</Text>
                                </HStack>
                              </Badge>
                            </Td>
                            <Td py={3} textAlign="center">
                              {m.situacao !== 1 ? (
                                <Tooltip label="Confirmar Pagamento">
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    variant="outline"
                                    rounded="xl"
                                    leftIcon={<FiCheck />}
                                    onClick={() => onConfirmarPagamento(m)}
                                  >
                                    Pagar
                                  </Button>
                                </Tooltip>
                              ) : (
                                <Badge colorScheme="green" rounded="full" px={2} py={0.5} fontSize="xs">
                                  Confirmado
                                </Badge>
                              )}
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </VStack>
    </Accordion>
  )
}
