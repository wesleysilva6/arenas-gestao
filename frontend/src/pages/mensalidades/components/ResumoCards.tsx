import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi'
import { formatMesReferencia } from '../../../service/mensalidades'

interface Props {
  valorPendentes: number
  valorAtrasadas: number
  valorPagas: number
  valorMesAtual: number
  totalPendentes: number
  totalAtrasadas: number
  totalPagas: number
  mesAtual: string
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ResumoCards({
  valorPendentes,
  valorAtrasadas,
  valorPagas,
  valorMesAtual,
  totalPendentes,
  totalAtrasadas,
  totalPagas,
  mesAtual,
}: Props) {
  return (
    <Flex gap={4} mb={6} wrap="wrap">
      <Flex
        bg="white"
        rounded="2xl"
        px={5}
        py={4}
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.100"
        flex="1"
        minW="200px"
      >
        <Flex w={10} h={10} rounded="xl" bg="yellow.50" align="center" justify="center">
          <Icon as={FiClock} boxSize={5} color="yellow.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="yellow.600" lineHeight="1">
            {formatCurrency(valorPendentes)}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
            Pendentes ({totalPendentes})
          </Text>
        </Box>
      </Flex>

      <Flex
        bg="white"
        rounded="2xl"
        px={5}
        py={4}
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.100"
        flex="1"
        minW="200px"
      >
        <Flex w={10} h={10} rounded="xl" bg="red.50" align="center" justify="center">
          <Icon as={FiAlertTriangle} boxSize={5} color="red.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="red.500" lineHeight="1">
            {formatCurrency(valorAtrasadas)}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
            Atrasadas ({totalAtrasadas})
          </Text>
        </Box>
      </Flex>

      <Flex
        bg="white"
        rounded="2xl"
        px={5}
        py={4}
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.100"
        flex="1"
        minW="200px"
      >
        <Flex w={10} h={10} rounded="xl" bg="green.50" align="center" justify="center">
          <Icon as={FiCheckCircle} boxSize={5} color="green.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="green.500" lineHeight="1">
            {formatCurrency(valorPagas)}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
            Recebido ({totalPagas})
          </Text>
        </Box>
      </Flex>

      <Flex
        bg="white"
        rounded="2xl"
        px={5}
        py={4}
        align="center"
        gap={3}
        border="1px solid"
        borderColor="gray.100"
        flex="1"
        minW="200px"
      >
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
          <Icon as={FiCalendar} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="brand.500" lineHeight="1">
            {formatCurrency(valorMesAtual)}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
            Receita {formatMesReferencia(mesAtual).split('/')[0]}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
