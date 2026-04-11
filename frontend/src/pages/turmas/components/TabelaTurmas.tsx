import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tag,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiLayers,
  FiMoreVertical,
  FiPlus,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi'
import type { Turma } from '../../../service/turmas'

interface Props {
  turmas: Turma[]
  loading: boolean
  search: string
  filtroSituacao: string
  filtroModalidade: string
  totalTurmas: number
  onEditar: (t: Turma) => void
  onToggleStatus: (t: Turma) => void
  onVerAlunos: (t: Turma) => void
  onNovo: () => void
}

export default function TabelaTurmas({
  turmas,
  loading,
  search,
  filtroSituacao,
  filtroModalidade,
  totalTurmas,
  onEditar,
  onToggleStatus,
  onVerAlunos,
  onNovo,
}: Props) {
  if (loading) {
    return (
      <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
        <VStack spacing={3}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} h="50px" w="full" rounded="lg" />
          ))}
        </VStack>
      </Box>
    )
  }

  if (turmas.length === 0) {
    return (
      <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
        <Flex p={12} justify="center" align="center" direction="column">
          <Icon as={FiLayers} boxSize={12} color="gray.300" mb={3} />
          <Text color="gray.400" fontSize="md" fontWeight="500">
            {search || filtroSituacao || filtroModalidade
              ? 'Nenhuma turma encontrada com esses filtros'
              : 'Nenhuma turma cadastrada ainda'}
          </Text>
          {!search && !filtroSituacao && !filtroModalidade && (
            <Button mt={4} colorScheme="brand" variant="outline" rounded="xl" onClick={onNovo} leftIcon={<FiPlus />}>
              Criar primeira turma
            </Button>
          )}
        </Flex>
      </Box>
    )
  }

  return (
    <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th color="gray.400" fontSize="xs" py={4}>Turma</Th>
              <Th color="gray.400" fontSize="xs" py={4}>Modalidade</Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', lg: 'table-cell' }}>
                Dias / Horário
              </Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', md: 'table-cell' }}>
                Professor
              </Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', md: 'table-cell' }}>
                Alunos
              </Th>
              <Th color="gray.400" fontSize="xs" py={4}>Status</Th>
              <Th color="gray.400" fontSize="xs" py={4} isNumeric>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {turmas.map((turma) => (
              <Tr key={turma.idturma} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                <Td py={3}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    {turma.nome}
                  </Text>
                </Td>
                <Td py={3}>
                  <Tag size="sm" colorScheme="brand" variant="subtle" rounded="full">
                    {turma.modalidade_nome ?? '—'}
                  </Tag>
                </Td>
                <Td py={3} display={{ base: 'none', lg: 'table-cell' }}>
                  <VStack align="start" spacing={1}>
                    <Wrap spacing={1}>
                      {turma.dias_semana.split(', ').map((dia) => (
                        <WrapItem key={dia}>
                          <Tag size="sm" variant="subtle" colorScheme="gray" rounded="full">
                            {dia}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    <HStack spacing={1}>
                      <Icon as={FiClock} boxSize={3} color="gray.400" />
                      <Text fontSize="xs" color="gray.500">
                        {turma.horario?.slice(0, 5)}
                      </Text>
                    </HStack>
                  </VStack>
                </Td>
                <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                  <Text fontSize="sm" color="gray.600">
                    {turma.professor ?? '—'}
                  </Text>
                </Td>
                <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                  <HStack spacing={1}>
                    <Icon as={FiUsers} boxSize={3} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">
                      {turma.alunos_count ?? 0}
                      {turma.limite_alunos ? ` / ${turma.limite_alunos}` : ''}
                    </Text>
                  </HStack>
                </Td>
                <Td py={3}>
                  <Badge
                    colorScheme={turma.situacao === 1 ? 'green' : 'gray'}
                    rounded="full"
                    px={2.5}
                    py={0.5}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {turma.situacao === 1 ? 'Ativa' : 'Inativa'}
                  </Badge>
                </Td>
                <Td py={3} isNumeric>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Mais ações"
                      icon={<FiMoreVertical />}
                      size="sm"
                      variant="ghost"
                      rounded="lg"
                      color="gray.400"
                    />
                    <MenuList shadow="xl" rounded="xl" border="1px solid" borderColor="gray.100" py={1} minW="160px">
                      <MenuItem
                        icon={<Icon as={FiUsers} />}
                        fontSize="sm"
                        color="gray.600"
                        _hover={{ bg: 'brand.50' }}
                        onClick={() => onVerAlunos(turma)}
                      >
                        Ver Alunos
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={FiEdit2} />}
                        fontSize="sm"
                        color="gray.600"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => onEditar(turma)}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={turma.situacao === 1 ? FiXCircle : FiCheckCircle} />}
                        fontSize="sm"
                        color={turma.situacao === 1 ? 'red.500' : 'green.500'}
                        _hover={{ bg: turma.situacao === 1 ? 'red.50' : 'green.50' }}
                        onClick={() => onToggleStatus(turma)}
                      >
                        {turma.situacao === 1 ? 'Desativar' : 'Reativar'}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Footer count */}
      <Flex px={6} py={3} borderTop="1px solid" borderColor="gray.50" justify="space-between" align="center">
        <Text fontSize="xs" color="gray.400">
          Exibindo {turmas.length} de {totalTurmas} turma{totalTurmas !== 1 ? 's' : ''}
        </Text>
      </Flex>
    </Box>
  )
}
