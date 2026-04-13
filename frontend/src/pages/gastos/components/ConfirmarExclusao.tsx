import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react'
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi'
import { formatCurrency } from '../../../utils/formatters'
import type { Gasto } from '../../../service/gastos'

interface Props {
  isOpen: boolean
  onClose: () => void
  gasto: Gasto | null
  deletando: boolean
  onConfirmar: () => void
}

export default function ConfirmarExclusao({ isOpen, onClose, gasto, deletando, onConfirmar }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
        <AlertDialogContent rounded="2xl" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
            <HStack spacing={2}>
              <Icon as={FiAlertTriangle} color="red.500" />
              <Text>Excluir Gasto</Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody color="gray.600" fontSize="sm">
            Tem certeza que deseja excluir o gasto{' '}
            <Text as="span" fontWeight="600" color="gray.800">
              "{gasto?.descricao}"
            </Text>{' '}
            no valor de{' '}
            <Text as="span" fontWeight="600" color="red.500">
              {gasto ? formatCurrency(gasto.valor) : ''}
            </Text>
            ? Esta ação não pode ser desfeita.
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose} variant="ghost" rounded="xl">
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirmar}
              isLoading={deletando}
              rounded="xl"
              leftIcon={<FiTrash2 />}
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
