import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import { FiSave } from 'react-icons/fi'
import { CATEGORIAS, type Gasto } from '../../../service/gastos'
import { maskCurrency, unmaskCurrency } from '../../../utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  gasto: Gasto | null
  saving: boolean
  onSalvar: (dados: { descricao: string; valor: number; categoria: string; data: string; observacao: string | null }) => void
}

export default function FormGasto({ isOpen, onClose, gasto, saving, onSalvar }: Props) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState('')
  const [observacao, setObservacao] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (gasto) {
        setDescricao(gasto.descricao)
        setValor(gasto.valor > 0 ? maskCurrency(String(Math.round(gasto.valor * 100))) : '')
        setCategoria(gasto.categoria)
        setData(gasto.data)
        setObservacao(gasto.observacao ?? '')
      } else {
        setDescricao('')
        setValor('')
        setCategoria('')
        setData(new Date().toISOString().slice(0, 10))
        setObservacao('')
      }
    }
  }, [isOpen, gasto])

  const valido =
    descricao.trim().length > 0 &&
    unmaskCurrency(valor) > 0 &&
    categoria.length > 0 &&
    data.length > 0

  function handleSubmit() {
    if (!valido) return
    onSalvar({
      descricao: descricao.trim(),
      valor: unmaskCurrency(valor),
      categoria,
      data,
      observacao: observacao.trim() || null,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4}>
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {gasto ? 'Editar Gasto' : 'Novo Gasto'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                Descrição
              </FormLabel>
              <Input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Troca de rede"
                rounded="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ bg: 'white', borderColor: 'brand.500' }}
                fontSize="sm"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                Valor
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Text fontSize="sm" color="gray.400" fontWeight="600">R$</Text>
                </InputLeftElement>
                <Input
                  value={valor}
                  onChange={(e) => setValor(maskCurrency(e.target.value))}
                  placeholder="0,00"
                  rounded="xl"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  _focus={{ bg: 'white', borderColor: 'brand.500' }}
                  fontSize="sm"
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                Categoria
              </FormLabel>
              <Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Selecione uma categoria"
                rounded="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ bg: 'white', borderColor: 'brand.500' }}
                fontSize="sm"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                Data
              </FormLabel>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                rounded="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ bg: 'white', borderColor: 'brand.500' }}
                fontSize="sm"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color="gray.600">
                Observação
              </FormLabel>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Observação opcional..."
                rounded="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ bg: 'white', borderColor: 'brand.500' }}
                fontSize="sm"
                rows={3}
                resize="none"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} rounded="xl">
            Cancelar
          </Button>
          <Button
            leftIcon={<FiSave />}
            colorScheme="brand"
            rounded="xl"
            isLoading={saving}
            loadingText="Salvando..."
            isDisabled={!valido}
            onClick={handleSubmit}
          >
            {gasto ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
