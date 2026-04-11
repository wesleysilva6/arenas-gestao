import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiCheckCircle, FiUsers, FiXCircle } from 'react-icons/fi'

interface Props {
  total: number
  ativos: number
  inativos: number
}

export default function ResumoCards({ total, ativos, inativos }: Props) {
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
        minW="160px"
      >
        <Flex w={10} h={10} rounded="xl" bg="brand.50" align="center" justify="center">
          <Icon as={FiUsers} boxSize={5} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1">
            {total}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500">Total</Text>
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
        minW="160px"
      >
        <Flex w={10} h={10} rounded="xl" bg="green.50" align="center" justify="center">
          <Icon as={FiCheckCircle} boxSize={5} color="green.500" />
        </Flex>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1">
            {ativos}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500">Ativos</Text>
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
        minW="160px"
      >
        <Flex w={10} h={10} rounded="xl" bg="orange.50" align="center" justify="center">
          <Icon as={FiXCircle} boxSize={5} color="orange.500" />
        </Flex>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1">
            {inativos}
          </Text>
          <Text fontSize="xs" color="gray.400" fontWeight="500">Inativos</Text>
        </Box>
      </Flex>
    </Flex>
  )
}
