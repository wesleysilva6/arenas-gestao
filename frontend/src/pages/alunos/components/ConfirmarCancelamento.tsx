import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react'
import { useRef } from 'react'
import type { Aluno } from '../../../service/alunos'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirmar: () => void
  aluno: Aluno | null
  cancelando: boolean
}

export default function ConfirmarCancelamento({ isOpen, onClose, onConfirmar, aluno, cancelando }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent rounded="2xl">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancelar Aluno
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Tem certeza que deseja cancelar o aluno{' '}
              <Text as="span" fontWeight="bold">{aluno?.nome}</Text>?
            </Text>
            <Text mt={2} fontSize="sm" color="gray.500">
              O aluno será inativado e todas as mensalidades pendentes serão marcadas como canceladas.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} rounded="xl">
              Voltar
            </Button>
            <Button
              colorScheme="orange"
              onClick={onConfirmar}
              ml={3}
              rounded="xl"
              isLoading={cancelando}
              loadingText="Cancelando..."
            >
              Confirmar Cancelamento
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
