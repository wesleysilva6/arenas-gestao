import { useState } from 'react'
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
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import {
  FiShield,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
} from 'react-icons/fi'

interface Props {
  senhaVerificada: boolean
  verificando: boolean
  alterandoSenha: boolean
  onVerificarSenha: (senha: string) => Promise<void>
  onAlterarSenha: (senhaAtual: string, novaSenha: string) => Promise<void>
  onResetVerificacao: () => void
}

export default function SegurancaCard({
  senhaVerificada,
  verificando,
  alterandoSenha,
  onVerificarSenha,
  onAlterarSenha,
  onResetVerificacao,
}: Props) {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)

  const senhasDiferentes = novaSenha !== confirmarSenha
  const senhaFraca = novaSenha.length > 0 && novaSenha.length < 6

  const handleVerificar = () => onVerificarSenha(senhaAtual)

  const handleAlterar = async () => {
    await onAlterarSenha(senhaAtual, novaSenha)
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarSenha('')
  }

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
          bg="yellow.50"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={FiShield} boxSize={4} color="yellow.600" />
        </Flex>
        <Box>
          <Text fontSize="md" fontWeight="700" color="gray.800" lineHeight="1.2">
            Segurança
          </Text>
          <Text fontSize="xs" color="gray.400">
            Altere sua senha de acesso
          </Text>
        </Box>
      </HStack>

      <Divider mb={5} />

      <VStack spacing={4} align="stretch">
        {/* Etapa 1 — Senha atual */}
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
            <HStack spacing={1.5}>
              <Icon as={FiLock} boxSize={3.5} />
              <Text>Senha atual</Text>
            </HStack>
          </FormLabel>
          <InputGroup>
            <Input
              type={showSenhaAtual ? 'text' : 'password'}
              value={senhaAtual}
              onChange={(e) => {
                setSenhaAtual(e.target.value)
                if (senhaVerificada) onResetVerificacao()
              }}
              placeholder="Digite sua senha atual"
              rounded="xl"
              bg={senhaVerificada ? 'green.50' : 'gray.50'}
              border="1px solid"
              borderColor={senhaVerificada ? 'green.300' : 'gray.200'}
              _focus={{ bg: 'white', borderColor: 'brand.500' }}
              fontSize="sm"
              isReadOnly={senhaVerificada}
            />
            <InputRightElement>
              <IconButton
                aria-label="Mostrar senha"
                icon={showSenhaAtual ? <FiEyeOff /> : <FiEye />}
                size="sm"
                variant="ghost"
                color="gray.400"
                onClick={() => setShowSenhaAtual((v) => !v)}
                tabIndex={-1}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {/* Botão Verificar / Badge verificada */}
        {!senhaVerificada ? (
          <Button
            colorScheme="gray"
            variant="outline"
            rounded="xl"
            isLoading={verificando}
            loadingText="Verificando..."
            isDisabled={!senhaAtual}
            onClick={handleVerificar}
            w="full"
            leftIcon={<FiShield />}
          >
            Verificar Senha
          </Button>
        ) : (
          <Flex
            align="center"
            gap={2}
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            rounded="xl"
            px={4}
            py={2.5}
          >
            <Icon as={FiCheck} boxSize={4} color="green.500" />
            <Text fontSize="sm" color="green.700" fontWeight="600">
              Senha verificada
            </Text>
          </Flex>
        )}

        {/* Etapa 2 — Nova senha (visível só após verificação) */}
        {senhaVerificada && (
          <>
            <Divider />

            <FormControl isInvalid={senhaFraca}>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                Nova senha
              </FormLabel>
              <InputGroup>
                <Input
                  type={showNovaSenha ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  rounded="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                  fontSize="sm"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Mostrar nova senha"
                    icon={showNovaSenha ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => setShowNovaSenha((v) => !v)}
                    tabIndex={-1}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                A senha deve ter pelo menos 6 caracteres.
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={confirmarSenha.length > 0 && senhasDiferentes}>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600" mb={1}>
                Confirmar nova senha
              </FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmarSenha ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  rounded="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                  fontSize="sm"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Mostrar confirmação"
                    icon={showConfirmarSenha ? <FiEyeOff /> : <FiEye />}
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    onClick={() => setShowConfirmarSenha((v) => !v)}
                    tabIndex={-1}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">
                As senhas não coincidem.
              </FormErrorMessage>
            </FormControl>

            <Button
              leftIcon={<FiLock />}
              colorScheme="brand"
              rounded="xl"
              isLoading={alterandoSenha}
              loadingText="Alterando..."
              isDisabled={!novaSenha || senhaFraca || senhasDiferentes}
              onClick={handleAlterar}
              w="full"
            >
              Alterar Senha
            </Button>
          </>
        )}
      </VStack>
    </Box>
  )
}
