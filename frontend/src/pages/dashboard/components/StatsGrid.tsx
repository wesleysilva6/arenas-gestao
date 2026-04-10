import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import type { StatCard as StatCardType } from '../../../utils/types'

interface Props {
  cards: StatCardType[]
  loading: boolean
}

export default function StatsGrid({ cards, loading }: Props) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5} mb={8}>
      {cards.map((card) => (
        <Box
          key={card.label}
          bg={card.bg}
          rounded="2xl"
          p={5}
          border="1px solid"
          borderColor="blackAlpha.50"
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        >
          <Flex justify="space-between" align="start">
            <Box>
              <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                {card.label}
              </Text>
              <Skeleton isLoaded={!loading} mt={2}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {card.value}
                </Text>
              </Skeleton>
            </Box>
            <Flex
              w={10}
              h={10}
              rounded="xl"
              bg="white"
              align="center"
              justify="center"
              shadow="sm"
            >
              <Icon as={card.icon} boxSize={5} color={card.color} />
            </Flex>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  )
}
