import { Box, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { FiTrendingUp } from 'react-icons/fi';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        flex="1"
        bgGradient="linear(to-br, brand.700, brand.500)"
        color="white"
        align="center"
        justify="center"
        px={12}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="280px"
          h="280px"
          borderRadius="full"
          bg="whiteAlpha.200"
        />
        <Box
          position="absolute"
          bottom="-120px"
          left="-60px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />

        <VStack spacing={6} align="start" maxW="460px" position="relative" zIndex={1}>
          <Flex
            w="72px"
            h="72px"
            borderRadius="24px"
            align="center"
            justify="center"
            bg="whiteAlpha.200"
            backdropFilter="blur(8px)"
          >
            <Icon as={FiTrendingUp} boxSize={8} />
          </Flex>

          <VStack spacing={3} align="start">
            <Text textTransform="uppercase" letterSpacing="0.18em" fontSize="xs" fontWeight="700" color="whiteAlpha.800">
              NovaWave - Arena
            </Text>
            <Heading size="2xl" lineHeight="1.1">
              Gestão simples para a operação do seu sistema.
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              Acesse sua conta para acompanhar rotinas, dados e processos em um único painel.
            </Text>
          </VStack>
        </VStack>
      </Flex>

      <Flex flex="1" align="center" justify="center" px={{ base: 4, md: 8 }} py={{ base: 10, md: 12 }}>
        {children}
      </Flex>
    </Flex>
  );
}