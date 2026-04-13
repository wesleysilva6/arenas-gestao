import { useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { FiClock, FiTrash2 } from 'react-icons/fi'
import { limparHistorico, type MensagemLog } from '../../../service/mensagens'

interface Props {
  historico: MensagemLog[]
  onHistoricoLimpo: () => void
}

export default function HistoricoEnvios({ historico, onHistoricoLimpo }: Props) {
  const toast = useToast()
  const [isLimparOpen, setIsLimparOpen] = useState(false)
  const [limpando, setLimpando] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  async function handleLimpar() {
    setLimpando(true)
    try {
      await limparHistorico()
      onHistoricoLimpo()
      toast({ title: 'Histórico limpo com sucesso', status: 'success', duration: 3000, position: 'top-right' })
      setIsLimparOpen(false)
    } catch (err: any) {
      toast({ title: 'Erro ao limpar histórico', description: err.message, status: 'error', duration: 4000, position: 'top-right' })
    } finally {
      setLimpando(false)
    }
  }

  return (
    <>
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <HStack>
            <Flex w={8} h={8} rounded="lg" bg="gray.50" align="center" justify="center">
              <Icon as={FiClock} boxSize={4} color="gray.500" />
            </Flex>
            <Text fontSize="sm" fontWeight="700" color="gray.700">Histórico de envios</Text>
          </HStack>
          {historico.length > 0 && (
            <Tooltip label="Limpar histórico">
              <IconButton
                aria-label="Limpar histórico"
                icon={<FiTrash2 />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => setIsLimparOpen(true)}
              />
            </Tooltip>
          )}
        </Flex>

        {historico.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Text fontSize="sm" color="gray.400">Nenhuma mensagem enviada ainda.</Text>
          </Box>
        ) : (
          <VStack spacing={2} align="stretch" maxH="380px" overflowY="auto">
            {historico.map((h) => (
              <Box key={h.idmensagem} p={3} rounded="xl" bg="gray.50" border="1px solid" borderColor="gray.100">
                <Flex justify="space-between" align="center" mb={1}>
                  <Badge
                    rounded="full"
                    fontSize="2xs"
                    px={2}
                    colorScheme={
                      h.tipo === 'aluno' ? 'cyan'
                        : h.tipo === 'turma' ? 'blue'
                        : h.tipo === 'modalidade' ? 'purple'
                        : h.tipo === 'grupo' ? 'green'
                        : 'orange'
                    }
                  >
                    {h.tipo === 'aluno' ? 'Aluno' : h.tipo === 'turma' ? 'Turma' : h.tipo === 'modalidade' ? 'Modalidade' : h.tipo === 'grupo' ? 'Grupo' : 'Todos'}
                  </Badge>
                  <Text fontSize="xs" color="gray.400">
                    {new Date(h.enviado_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Flex>
                {h.destino && <Text fontSize="xs" color="gray.500" mb={1}>→ {h.destino}</Text>}
                <Text fontSize="sm" color="gray.700" noOfLines={2}>{h.mensagem}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* AlertDialog: Limpar Histórico */}
      <AlertDialog isOpen={isLimparOpen} leastDestructiveRef={cancelRef as any} onClose={() => setIsLimparOpen(false)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent rounded="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
              Limpar histórico
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              Tem certeza que deseja apagar <b>todo o histórico</b> de mensagens enviadas? Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" color="gray.500" onClick={() => setIsLimparOpen(false)}>Cancelar</Button>
              <Button colorScheme="red" ml={3} rounded="lg" isLoading={limpando} onClick={handleLimpar}>
                Limpar tudo
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
