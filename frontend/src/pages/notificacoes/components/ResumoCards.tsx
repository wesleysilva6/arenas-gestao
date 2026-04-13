import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiBell, FiAlertTriangle, FiClock } from 'react-icons/fi'

interface Props {
  loading: boolean
  total: number
  naoLidas: number
  atraso: number
  vencimento: number
}

export default function ResumoCards({ loading, total, naoLidas, atraso, vencimento }: Props) {
  const cards = [
    { label: 'Total', value: total, iconBg: 'gray.100', iconColor: 'gray.500', icon: FiBell },
    { label: 'Não lidas', value: naoLidas, iconBg: 'brand.50', iconColor: 'brand.500', icon: FiBell },
    { label: 'Em Atraso', value: atraso, iconBg: 'red.50', iconColor: 'red.500', icon: FiAlertTriangle },
    { label: 'A Vencer', value: vencimento, iconBg: 'yellow.50', iconColor: 'yellow.600', icon: FiClock },
  ]

  return (
    <Flex gap={4} mb={6} wrap="wrap">
      {cards.map(c => (
        <Flex
          key={c.label}
          bg="white"
          rounded="2xl"
          px={5}
          py={4}
          align="center"
          gap={3}
          border="1px solid"
          borderColor="gray.100"
          flex="1"
          minW="140px"
        >
          <Flex w={10} h={10} rounded="xl" bg={c.iconBg} align="center" justify="center">
            <Icon as={c.icon} boxSize={5} color={c.iconColor} />
          </Flex>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1">
              {loading ? '–' : c.value}
            </Text>
            <Text fontSize="xs" color="gray.400" fontWeight="500">{c.label}</Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}
