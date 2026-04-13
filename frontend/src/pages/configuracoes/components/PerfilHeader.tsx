import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
} from '@chakra-ui/react'

interface Props {
  nome: string
  email: string
}

export default function PerfilHeader({ nome, email }: Props) {
  return (
    <Flex
      bg="white"
      rounded="2xl"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 5, md: 6 }}
      mb={6}
      align="center"
      gap={5}
      wrap="wrap"
    >
      <Avatar
        size="xl"
        name={nome || 'U'}
        bg="brand.500"
        color="white"
        fontWeight="700"
        fontSize="2xl"
      />
      <Box flex={1}>
        <Text fontSize="xl" fontWeight="700" color="gray.800" lineHeight="1.2">
          {nome || 'Usuário'}
        </Text>
        <Text fontSize="sm" color="gray.400" mt={0.5}>
          {email}
        </Text>
        <Badge
          mt={2}
          colorScheme="green"
          rounded="full"
          px={3}
          py={0.5}
          fontSize="xs"
          fontWeight="600"
        >
          Administrador
        </Badge>
      </Box>
    </Flex>
  )
}
