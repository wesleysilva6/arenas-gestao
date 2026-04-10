import { useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import type { ModalidadeForm } from '../../../service/modalidades'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSalvar: (dados: ModalidadeForm) => Promise<void>
  modalidade: ModalidadeForm | null
  salvando: boolean
}

export default function ModalModalidade({ isOpen, onClose, onSalvar, modalidade, salvando }: Props) {
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (modalidade) {
      setNome(modalidade.nome)
    } else {
      setNome('')
    }
  }, [modalidade, isOpen])

  const handleSubmit = async () => {
    await onSalvar({
      nome,
      situacao: modalidade?.situacao ?? 1,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl">
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {modalidade ? 'Editar Modalidade' : 'Nova Modalidade'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Nome</FormLabel>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Beach Tennis, Funcional..."
                size="lg"
                rounded="xl"
                bg="gray.50"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} rounded="xl">
            Cancelar
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={salvando}
            isDisabled={!nome.trim()}
            rounded="xl"
            px={8}
          >
            {modalidade ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
