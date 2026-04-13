import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FiTrendingDown, FiCalendar, FiPieChart } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'

interface Props {
  totalMes: number
  totalGeral: number
  quantidadeMes: number
  mesLabel: string
  loading: boolean
}

export default function ResumoCards({
  totalMes,
  totalGeral,
  quantidadeMes,
  mesLabel,
  loading,
}: Props) {
  const cards = [
    {
      label: `Gastos em ${mesLabel}`,
      value: formatCurrency(totalMes),
      sub: `${quantidadeMes} registro${quantidadeMes !== 1 ? 's' : ''}`,
      icon: FiCalendar,
      iconBg: 'brand.50',
      iconColor: 'brand.500',
      valueColor: 'brand.600',
    },
    {
      label: 'Total geral',
      value: formatCurrency(totalGeral),
      sub: 'Todos os meses',
      icon: FiTrendingDown,
      iconBg: 'red.50',
      iconColor: 'red.500',
      valueColor: 'red.500',
    },
    {
      label: 'Média por gasto',
      value: quantidadeMes > 0 ? formatCurrency(totalMes / quantidadeMes) : 'R$ 0,00',
      sub: mesLabel,
      icon: FiPieChart,
      iconBg: 'purple.50',
      iconColor: 'purple.500',
      valueColor: 'purple.600',
    },
  ]

  return (
    <Flex gap={4} mb={6} wrap="wrap">
      {cards.map((card) => (
        <Flex
          key={card.label}
          bg="white"
          rounded="2xl"
          px={5}
          py={4}
          align="center"
          gap={3}
          border="1px solid"
          borderColor="gray.100"
          flex="1"
          minW="220px"
          opacity={loading ? 0.5 : 1}
          transition="opacity 0.2s"
        >
          <Flex w={10} h={10} rounded="xl" bg={card.iconBg} align="center" justify="center">
            <Icon as={card.icon} boxSize={5} color={card.iconColor} />
          </Flex>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color={card.valueColor} lineHeight="1">
              {card.value}
            </Text>
            <Text fontSize="xs" color="gray.400" fontWeight="500" mt={0.5}>
              {card.sub}
            </Text>
          </Box>
        </Flex>
      ))}
    </Flex>
  )
}
