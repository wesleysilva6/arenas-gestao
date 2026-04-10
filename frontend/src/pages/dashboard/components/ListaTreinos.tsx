import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCalendar, FiClock } from 'react-icons/fi'
import type { Treino } from '../../../utils/types'

interface Props {
  treinos: Treino[]
  loading: boolean
}

export default function ListaTreinos({ treinos, loading }: Props) {
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
          <Icon as={FiCalendar} color="brand.500" />
          <Heading size="sm" color="gray.700">
            Treinos de Hoje
          </Heading>
        </HStack>
        <Badge colorScheme="green" rounded="full" px={2} fontSize="xs">
          {treinos.length}
        </Badge>
      </Flex>

      {loading ? (
        <VStack p={6} spacing={3}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} h="60px" w="full" rounded="lg" />
          ))}
        </VStack>
      ) : treinos.length === 0 ? (
        <Flex p={8} justify="center" align="center" direction="column">
          <Icon as={FiCalendar} boxSize={10} color="gray.300" mb={3} />
          <Text color="gray.400" fontSize="sm">
            Nenhum treino agendado para hoje
          </Text>
        </Flex>
      ) : (
        <VStack spacing={0} divider={<Box borderBottom="1px solid" borderColor="gray.50" />}>
          {treinos.map((t, i) => (
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
  )
}
