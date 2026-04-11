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
import type { Turma } from '../../../service/turmas'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => Promise<void>
  turma: Turma | null
  processando: boolean
}

export default function ConfirmarToggleStatus({ isOpen, onClose, onConfirmar, turma, processando }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const desativar = turma?.situacao === 1

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
        <AlertDialogContent rounded="2xl" mx={4}>
          <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
            {desativar ? 'Desativar Turma' : 'Reativar Turma'}
          </AlertDialogHeader>
          <AlertDialogBody color="gray.600">
            {desativar
              ? `Tem certeza que deseja desativar a turma "${turma?.nome}"?`
              : `Deseja reativar a turma "${turma?.nome}"?`}
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
