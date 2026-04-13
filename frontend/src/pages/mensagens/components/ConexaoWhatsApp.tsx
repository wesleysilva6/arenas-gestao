import {
  Box,
  Button,
  CircularProgress,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  FiExternalLink,
  FiSend,
  FiSmartphone,
  FiWifi,
  FiWifiOff,
} from 'react-icons/fi'
import type { WaStatus } from '../../../service/whatsapp'

interface Props {
  waStatus: WaStatus
  waNumber: string | null
  waQr: string | null
  isQrOpen: boolean
  onQrClose: () => void
  onConnect: () => void
  onDisconnect: () => void
}

export default function ConexaoWhatsApp({
  waStatus, waNumber, waQr,
  isQrOpen, onQrClose,
  onConnect, onDisconnect,
}: Props) {
  return (
    <>
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5} mb={5}>
        <HStack mb={4}>
          <Flex w={8} h={8} rounded="lg" bg={waStatus === 'connected' ? 'green.50' : 'gray.50'} align="center" justify="center">
            <Icon as={waStatus === 'connected' ? FiWifi : FiWifiOff} boxSize={4} color={waStatus === 'connected' ? 'green.600' : 'gray.400'} />
          </Flex>
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="700" color="gray.700">WhatsApp</Text>
            <HStack spacing={1} mt={0.5}>
              <Box w={2} h={2} rounded="full" bg={waStatus === 'connected' ? 'green.400' : waStatus === 'connecting' || waStatus === 'qr' ? 'orange.400' : 'gray.300'} />
              <Text fontSize="xs" color="gray.500">
                {waStatus === 'connected' ? `Conectado${waNumber ? ` — ${waNumber}` : ''}`
                  : waStatus === 'connecting' ? 'Conectando...'
                  : waStatus === 'qr' ? 'Aguardando leitura do QR...'
                  : 'Desconectado'}
              </Text>
            </HStack>
          </Box>
        </HStack>

        {waStatus === 'connected' ? (
          <Button
            size="sm"
            w="full"
            variant="outline"
            colorScheme="red"
            leftIcon={<FiWifiOff />}
            rounded="lg"
            onClick={onDisconnect}
          >
            Desconectar
          </Button>
        ) : waStatus === 'connecting' || waStatus === 'qr' ? (
          <Button size="sm" w="full" variant="outline" colorScheme="orange" rounded="lg" isLoading loadingText="Conectando..." isDisabled />
        ) : (
          <Button
            size="sm"
            w="full"
            colorScheme="green"
            leftIcon={<FiSmartphone />}
            rounded="lg"
            onClick={onConnect}
          >
            Conectar WhatsApp
          </Button>
        )}

        {waStatus === 'connected' && (
          <Flex mt={3} p={2} rounded="lg" bg="green.50" border="1px solid" borderColor="green.100" align="center" gap={2}>
            <Icon as={FiSend} color="green.500" boxSize={3.5} />
            <Text fontSize="xs" color="green.700">Mensagens serão enviadas automaticamente.</Text>
          </Flex>
        )}

        {waStatus === 'disconnected' && (
          <Flex mt={3} p={2} rounded="lg" bg="gray.50" border="1px solid" borderColor="gray.100" align="center" gap={2}>
            <Icon as={FiExternalLink} color="gray.400" boxSize={3.5} />
            <Text fontSize="xs" color="gray.500">Sem conexão — links wa.me serão abertos.</Text>
          </Flex>
        )}
      </Box>

      {/* Modal QR Code */}
      <Modal isOpen={isQrOpen} onClose={onQrClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader color="gray.800" fontSize="lg" fontWeight="700" textAlign="center">
            Conectar WhatsApp
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              {waQr ? (
                <>
                  <Image src={waQr} alt="QR Code WhatsApp" w="260px" h="260px" rounded="xl" border="1px solid" borderColor="gray.200" />
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Abra o WhatsApp no seu celular, vá em <b>Dispositivos conectados</b> e escaneie o QR Code acima.
                  </Text>
                </>
              ) : (
                <VStack py={8} spacing={3}>
                  <CircularProgress isIndeterminate color="green.400" size="50px" />
                  <Text fontSize="sm" color="gray.500">Gerando QR Code...</Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
