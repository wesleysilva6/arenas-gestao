import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useRef } from 'react'
import type { Modalidade } from '../../../service/modalidades'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => Promise<void>
  modalidade: Modalidade | null
  processando: boolean
}

export default function ConfirmarToggleStatus({ isOpen, onClose, onConfirmar, modalidade, processando }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const desativar = modalidade?.situacao === 1

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
        <AlertDialogContent rounded="2xl" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
            {desativar ? 'Desativar Modalidade' : 'Reativar Modalidade'}
          </AlertDialogHeader>
          <AlertDialogBody color="gray.600">
            {desativar
              ? `Tem certeza que deseja desativar a modalidade "${modalidade?.nome}"? Turmas e alunos vinculados não serão afetados.`
              : `Deseja reativar a modalidade "${modalidade?.nome}"?`}
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} onClick={onClose} variant="ghost" rounded="xl">
              Cancelar
            </Button>
            <Button
              colorScheme={desativar ? 'red' : 'green'}
              onClick={onConfirmar}
              isLoading={processando}
              rounded="xl"
            >
              {desativar ? 'Desativar' : 'Reativar'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
