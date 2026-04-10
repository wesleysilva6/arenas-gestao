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
  VStack,
} from '@chakra-ui/react'
import {
  FiCheckCircle,
  FiEdit2,
  FiGrid,
  FiMoreVertical,
  FiPlus,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi'
import type { Modalidade } from '../../../service/modalidades'

interface Props {
  modalidades: Modalidade[]
  loading: boolean
  search: string
  filtroSituacao: string
  onEditar: (m: Modalidade) => void
  onToggleStatus: (m: Modalidade) => void
  onNovo: () => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export default function TabelaModalidades({
  modalidades,
  loading,
  search,
  filtroSituacao,
  onEditar,
  onToggleStatus,
  onNovo,
}: Props) {
  if (loading) {
    return (
      <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
        <VStack spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h="50px" w="full" rounded="lg" />
          ))}
        </VStack>
      </Box>
    )
  }

  if (modalidades.length === 0) {
    return (
      <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
        <Flex p={12} justify="center" align="center" direction="column">
          <Icon as={FiGrid} boxSize={12} color="gray.300" mb={3} />
          <Text color="gray.400" fontSize="md" fontWeight="500">
            {search || filtroSituacao
              ? 'Nenhuma modalidade encontrada com esses filtros'
              : 'Nenhuma modalidade cadastrada ainda'}
          </Text>
          {!search && !filtroSituacao && (
            <Button
              mt={4}
              colorScheme="brand"
              variant="outline"
              rounded="xl"
              onClick={onNovo}
              leftIcon={<FiPlus />}
            >
              Cadastrar primeira modalidade
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
              <Th color="gray.400" fontSize="xs" py={4}>Modalidade</Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', md: 'table-cell' }}>Alunos Ativos</Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', md: 'table-cell' }}>Turmas</Th>
              <Th color="gray.400" fontSize="xs" py={4} display={{ base: 'none', lg: 'table-cell' }}>Criado em</Th>
              <Th color="gray.400" fontSize="xs" py={4}>Status</Th>
              <Th color="gray.400" fontSize="xs" py={4} isNumeric>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {modalidades.map((mod) => (
              <Tr key={mod.idmodalidade} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                <Td py={3}>
                  <HStack spacing={3}>
                    <Flex
                      w={9}
                      h={9}
                      rounded="xl"
                      bg={mod.situacao === 1 ? 'brand.50' : 'gray.100'}
                      align="center"
                      justify="center"
                    >
                      <Icon as={FiGrid} boxSize={4} color={mod.situacao === 1 ? 'brand.500' : 'gray.400'} />
                    </Flex>
                    <Text fontSize="sm" fontWeight="600" color="gray.700">
                      {mod.nome}
                    </Text>
                  </HStack>
                </Td>
                <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                  <HStack spacing={1}>
                    <Icon as={FiUsers} boxSize={3} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">{mod.alunos_count ?? 0}</Text>
                  </HStack>
                </Td>
                <Td py={3} display={{ base: 'none', md: 'table-cell' }}>
                  <Text fontSize="sm" color="gray.600">{mod.turmas_count ?? 0}</Text>
                </Td>
                <Td py={3} display={{ base: 'none', lg: 'table-cell' }}>
                  <Text fontSize="sm" color="gray.500">{formatDate(mod.criado_em)}</Text>
                </Td>
                <Td py={3}>
                  <Badge
                    colorScheme={mod.situacao === 1 ? 'green' : 'gray'}
                    rounded="full"
                    px={2.5}
                    py={0.5}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {mod.situacao === 1 ? 'Ativa' : 'Inativa'}
                  </Badge>
                </Td>
                <Td py={3} isNumeric>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Ações"
                      icon={<FiMoreVertical />}
                      size="sm"
                      variant="ghost"
                      rounded="lg"
                      color="gray.400"
                    />
                    <MenuList shadow="xl" rounded="xl" border="1px solid" borderColor="gray.100" py={1} minW="160px">
                      <MenuItem
                        icon={<Icon as={FiEdit2} />}
                        fontSize="sm"
                        color="gray.600"
                        _hover={{ bg: 'gray.50' }}
                        onClick={() => onEditar(mod)}
                      >
                        Editar
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={mod.situacao === 1 ? FiXCircle : FiCheckCircle} />}
                        fontSize="sm"
                        color={mod.situacao === 1 ? 'red.500' : 'green.500'}
                        _hover={{ bg: mod.situacao === 1 ? 'red.50' : 'green.50' }}
                        onClick={() => onToggleStatus(mod)}
                      >
                        {mod.situacao === 1 ? 'Desativar' : 'Reativar'}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex px={6} py={3} borderTop="1px solid" borderColor="gray.50" justify="space-between" align="center">
        <Text fontSize="xs" color="gray.400">
          Exibindo {modalidades.length} modalidade{modalidades.length !== 1 ? 's' : ''}
        </Text>
      </Flex>
    </Box>
  )
}
