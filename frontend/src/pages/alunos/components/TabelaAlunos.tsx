import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { FiEdit2, FiBarChart2, FiLayers, FiTrash2, FiUsers, FiXCircle } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'
import type { Aluno } from '../../../service/alunos'

interface Props {
  alunos: Aluno[]
  loading: boolean
  onEditar: (aluno: Aluno) => void
  onDeletar: (aluno: Aluno) => void
  onCancelar: (aluno: Aluno) => void
  onVerTurmas: (aluno: Aluno) => void
  onVerPresencas: (aluno: Aluno) => void
}

export default function TabelaAlunos({ alunos, loading, onEditar, onDeletar, onCancelar, onVerTurmas, onVerPresencas }: Props) {
  if (loading) {
    return (
      <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" p={6}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} h="50px" w="full" rounded="lg" mb={3} />
        ))}
      </Box>
    )
  }

  if (alunos.length === 0) {
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
      >
        <Icon as={FiUsers} boxSize={12} color="gray.300" mb={3} />
        <Text color="gray.400" fontSize="sm">Nenhum aluno cadastrado</Text>
      </Flex>
    )
  }

  return (
    <Box bg="white" rounded="2xl" shadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th color="gray.500" fontSize="xs">Aluno</Th>
            <Th color="gray.500" fontSize="xs">Telefone</Th>
            <Th color="gray.500" fontSize="xs">Modalidade</Th>
            <Th color="gray.500" fontSize="xs">Plano</Th>
            <Th color="gray.500" fontSize="xs" isNumeric>Mensalidade</Th>
            <Th color="gray.500" fontSize="xs">Vencimento</Th>
            <Th color="gray.500" fontSize="xs">Status</Th>
            <Th color="gray.500" fontSize="xs" textAlign="center">Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {alunos.map((aluno) => (
            <Tr key={aluno.idaluno} _hover={{ bg: 'gray.50' }} transition="background 0.15s">
              <Td>
                <HStack spacing={3}>
                  <Avatar size="sm" name={aluno.nome} bg="brand.100" color="brand.700" />
                  <Text fontSize="sm" fontWeight="600" color="gray.700">
                    {aluno.nome}
                  </Text>
                </HStack>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.600">{aluno.telefone}</Text>
              </Td>
              <Td>
                <Badge colorScheme="purple" rounded="full" px={2} fontSize="xs">
                  {aluno.modalidade_nome}
                </Badge>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                  {aluno.plano}
                </Text>
              </Td>
              <Td isNumeric>
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  {formatCurrency(Number(aluno.valor_mensalidade))}
                </Text>
              </Td>
              <Td>
                <Text fontSize="sm" color="gray.600">Dia {aluno.dia_vencimento}</Text>
              </Td>
              <Td>
                <Badge
                  colorScheme={aluno.situacao === 1 ? 'green' : 'red'}
                  rounded="full"
                  px={2}
                  fontSize="xs"
                >
                  {aluno.situacao === 1 ? 'Ativo' : 'Inativo'}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={1} justify="center">
                  <IconButton
                    aria-label="Ver Presenças"
                    icon={<FiBarChart2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => onVerPresencas(aluno)}
                  />
                  <IconButton
                    aria-label="Ver Turmas"
                    icon={<FiLayers />}
                    size="sm"
                    variant="ghost"
                    colorScheme="purple"
                    onClick={() => onVerTurmas(aluno)}
                  />
                  <IconButton
                    aria-label="Editar"
                    icon={<FiEdit2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onEditar(aluno)}
                  />
                  {aluno.situacao === 1 && (
                    <IconButton
                      aria-label="Cancelar"
                      icon={<FiXCircle />}
                      size="sm"
                      variant="ghost"
                      colorScheme="orange"
                      onClick={() => onCancelar(aluno)}
                    />
                  )}
                  <IconButton
                    aria-label="Remover"
                    icon={<FiTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDeletar(aluno)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
