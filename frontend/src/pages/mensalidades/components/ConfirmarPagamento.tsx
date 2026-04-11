import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import type { Mensalidade } from '../../../service/mensalidades'
import { formatMesReferencia } from '../../../service/mensalidades'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => void
  mensalidade: Mensalidade | null
  confirmando: boolean
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ConfirmarPagamento({ isOpen, onClose, onConfirmar, mensalidade, confirmando }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)">
        <AlertDialogContent rounded="2xl" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
            Confirmar Pagamento
          </AlertDialogHeader>
          <AlertDialogBody color="gray.600">
            <VStack align="start" spacing={2}>
              <Text>
                Confirmar pagamento de{' '}
                <Text as="span" fontWeight="700" color="gray.800">
                  {mensalidade ? formatCurrency(mensalidade.valor) : ''}
                </Text>{' '}
                referente a{' '}
                <Text as="span" fontWeight="600">
                  {mensalidade ? formatMesReferencia(mensalidade.mes_referencia) : ''}
                </Text>
                ?
              </Text>
              <Text fontSize="sm" color="gray.500">Aluno: {mensalidade?.aluno_nome}</Text>
              <Text fontSize="sm" color="gray.500">A data de pagamento será registrada como hoje.</Text>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose} variant="ghost" rounded="xl">
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={onConfirmar}
              isLoading={confirmando}
              loadingText="Confirmando..."
              rounded="xl"
              leftIcon={<FiCheck />}
            >
              Confirmar Pagamento
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
