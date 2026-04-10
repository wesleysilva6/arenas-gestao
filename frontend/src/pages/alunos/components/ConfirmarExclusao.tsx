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
import type { Aluno } from '../../../service/alunos'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => Promise<void>
  aluno: Aluno | null
  deletando: boolean
}

export default function ConfirmarExclusao({ isOpen, onClose, onConfirmar, aluno, deletando }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)">
        <AlertDialogContent rounded="2xl">
          <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
            Remover Aluno
          </AlertDialogHeader>

          <AlertDialogBody color="gray.600">
            Tem certeza que deseja remover <strong>{aluno?.nome}</strong>? Esta ação não pode ser desfeita.
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
              px={8}
            >
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
