import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link as ChakraLink,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiTrendingUp } from 'react-icons/fi';
import AuthLayout from '../../AuthLayout';
import { efetuarLogin } from '../../service/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await efetuarLogin(email, senha);
      
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo ao Controle - Arena.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Email ou senha inválidos.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Box w="full" maxW="440px">
        <Flex display={{ base: 'flex', lg: 'none' }} justify="center" mb={6}>
          <Flex
            align="center"
            justify="center"
            w="120px"
            h="120px"
            borderRadius="3xl"
            bgGradient="linear(to-br, brand.600, brand.400)"
            boxShadow="xl"
          >
            <Icon as={FiTrendingUp} color="white" boxSize={10} />
          </Flex>
        </Flex>

        <Box bg="white" rounded="2xl" shadow="xl" p={{ base: 8, md: 10 }} border="1px solid" borderColor="gray.100">
          <VStack spacing={1} mb={8} align="start">
            <Heading size="lg" color="gray.800" fontWeight="700">
              Bem-vindo de volta
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Entre com suas credenciais para acessar o sistema
            </Text>
          </VStack>

          <form onSubmit={handleLogin}>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  E-mail
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="xl"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      bg: 'white',
                    }}
                    _placeholder={{ color: 'gray.400' }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Senha
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="xl"
                    _hover={{ borderColor: 'gray.300' }}
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      bg: 'white',
                    }}
                    _placeholder={{ color: 'gray.400' }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.400"
                      _hover={{ color: 'gray.600', bg: 'transparent' }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="full"
                size="lg"
                bg="brand.500"
                color="white"
                rounded="xl"
                _hover={{ bg: 'brand.600', transform: 'translateY(-1px)', shadow: 'lg' }}
                _active={{ bg: 'brand.700', transform: 'translateY(0)' }}
                transition="all 0.2s"
                isLoading={isLoading}
                loadingText="Entrando..."
                mt={1}
                fontSize="md"
                fontWeight="600"
                rightIcon={<FiArrowRight />}
              >
                Entrar
              </Button>
            </VStack>
          </form>

          <HStack my={6}>
            <Divider borderColor="gray.200" />
            <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" px={3}>
              ou
            </Text>
            <Divider borderColor="gray.200" />
          </HStack>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Não tem uma conta?{' '}
            <ChakraLink
              as={Link}
              to="/cadastro"
              color="brand.500"
              fontWeight="600"
              _hover={{ color: 'brand.600', textDecoration: 'underline' }}
            >
              Criar conta
            </ChakraLink>
          </Text>
        </Box>

        <Text mt={6} textAlign="center" fontSize="xs" color="gray.400">
          © {new Date().getFullYear()} Arena Fitway. Todos os direitos reservados.
        </Text>
      </Box>
    </AuthLayout>
  );
}
