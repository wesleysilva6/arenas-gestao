import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
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
import { FiCheckCircle, FiDollarSign } from 'react-icons/fi'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import type { Vencimento } from '../../../utils/types'

interface Props {
  vencimentos: Vencimento[]
  loading: boolean
}

export default function TabelaVencimentos({ vencimentos, loading }: Props) {
  return (
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
          {vencimentos.length}
        </Badge>
      </Flex>

      {loading ? (
        <VStack p={6} spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h="40px" w="full" rounded="lg" />
          ))}
        </VStack>
      ) : vencimentos.length === 0 ? (
        <Flex p={8} justify="center" align="center" direction="column">
          <Icon as={FiCheckCircle} boxSize={10} color="green.400" mb={3} />
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
            {vencimentos.map((v, i) => (
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
  )
}
