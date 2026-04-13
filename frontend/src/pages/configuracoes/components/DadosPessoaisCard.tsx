import {
  Box,
  VStack,
  HStack,
  Flex,
  Text,
  Icon,
  Input,
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiSave } from 'react-icons/fi'

interface Props {
  nome: string
  email: string
  onNomeChange: (v: string) => void
  onEmailChange: (v: string) => void
  dadosMudaram: boolean
  saving: boolean
  onSalvar: () => void
}

export default function DadosPessoaisCard({
  nome,
  email,
  onNomeChange,
  onEmailChange,
  dadosMudaram,
  saving,
  onSalvar,
}: Props) {
  const nomeInvalido = nome.trim().length > 0 && nome.trim().length < 2
  const emailInvalido =
    email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  return (
    <Box
      flex={1}
      bg="white"
      rounded="2xl"
      border="1px solid"
      borderColor="gray.100"
      p={{ base: 5, md: 6 }}
    >
      <HStack spacing={3} mb={5}>
        <Flex
          w={9}
          h={9}
          rounded="xl"
          bg="brand.50"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={FiUser} boxSize={4} color="brand.500" />
        </Flex>
        <Box>
          <Text fontSize="md" fontWeight="700" color="gray.800" lineHeight="1.2">
            Informações Pessoais
          </Text>
          <Text fontSize="xs" color="gray.400">
            Atualize seu nome e e-mail
          </Text>
        </Box>
      </HStack>

      <Divider mb={5} />

      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={nomeInvalido}>
          <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
            <HStack spacing={1.5}>
              <Icon as={FiUser} boxSize={3.5} />
              <Text>Nome completo</Text>
            </HStack>
          </FormLabel>
          <Input
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder="Seu nome completo"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
          />
          <FormErrorMessage fontSize="xs">
            Nome deve ter pelo menos 2 caracteres.
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={emailInvalido}>
          <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
            <HStack spacing={1.5}>
              <Icon as={FiMail} boxSize={3.5} />
              <Text>E-mail</Text>
            </HStack>
          </FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            rounded="xl"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            fontSize="sm"
          />
          <FormErrorMessage fontSize="xs">
            Informe um e-mail válido.
          </FormErrorMessage>
        </FormControl>

        <Button
          leftIcon={<FiSave />}
          colorScheme="brand"
          rounded="xl"
          mt={1}
          isLoading={saving}
          loadingText="Salvando..."
          isDisabled={!dadosMudaram || nomeInvalido || emailInvalido}
          onClick={onSalvar}
          w="full"
        >
          Salvar Alterações
        </Button>
      </VStack>
    </Box>
  )
}
