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
  Select,
  SimpleGrid,
  Switch,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import type { Aluno, Modalidade } from '../../../service/alunos'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSalvar: (dados: Partial<Aluno>) => Promise<void>
  aluno: Aluno | null
  modalidades: Modalidade[]
  salvando: boolean
}

const PLANOS = ['mensal', 'trimestral', 'semestral', 'anual']

const MESES_POR_PLANO: Record<string, number> = {
  mensal: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
}

function calcularVencimentoContrato(plano: string, dataInicio: string): string {
  if (!dataInicio) return ''
  const date = new Date(dataInicio + 'T00:00:00')
  const meses = MESES_POR_PLANO[plano] ?? 1
  date.setMonth(date.getMonth() + meses)
  return date.toISOString().split('T')[0]
}

export default function ModalAluno({ isOpen, onClose, onSalvar, aluno, modalidades, salvando }: Props) {
  const [form, setForm] = useState<Partial<Aluno>>({})

  useEffect(() => {
    if (aluno) {
      setForm({ ...aluno })
    } else {
      setForm({
        nome: '',
        telefone: '',
        modalidade_id: undefined,
        data_inicio: '',
        dia_vencimento: 10,
        notificacao_whatsapp: 1,
        situacao: 1,
        observacao: '',
        valor_mensalidade: 0,
        plano: 'mensal',
        data_inicio_contrato: '',
        data_vencimento_contrato: '',
      })
    }
  }, [aluno, isOpen])

  useEffect(() => {
    const plano = form.plano ?? 'mensal'
    const inicio = form.data_inicio_contrato ?? ''
    const vencimento = calcularVencimentoContrato(plano, inicio)
    setForm((prev) => ({ ...prev, data_vencimento_contrato: vencimento }))
  }, [form.plano, form.data_inicio_contrato])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSalvar(form)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl">
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {aluno ? 'Editar Aluno' : 'Novo Aluno'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={4}>
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Nome</FormLabel>
                <Input
                  value={form.nome ?? ''}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  placeholder="Nome completo"
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Telefone</FormLabel>
                <Input
                  value={form.telefone ?? ''}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Modalidade</FormLabel>
                <Select
                  value={form.modalidade_id ?? ''}
                  onChange={(e) => handleChange('modalidade_id', Number(e.target.value))}
                  placeholder="Selecione"
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                >
                  {modalidades.map((m) => (
                    <option key={m.idmodalidade} value={m.idmodalidade}>
                      {m.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Plano</FormLabel>
                <Select
                  value={form.plano ?? 'mensal'}
                  onChange={(e) => handleChange('plano', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                >
                  {PLANOS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Valor Mensalidade</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={form.valor_mensalidade ?? 0}
                  onChange={(e) => handleChange('valor_mensalidade', parseFloat(e.target.value))}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Dia Vencimento</FormLabel>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={form.dia_vencimento ?? 10}
                  onChange={(e) => handleChange('dia_vencimento', parseInt(e.target.value))}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Data Início</FormLabel>
                <Input
                  type="date"
                  value={form.data_inicio ?? ''}
                  onChange={(e) => handleChange('data_inicio', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Início Contrato</FormLabel>
                <Input
                  type="date"
                  value={form.data_inicio_contrato ?? ''}
                  onChange={(e) => handleChange('data_inicio_contrato', e.target.value)}
                  size="lg"
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Vencimento Contrato</FormLabel>
                <Input
                  type="date"
                  value={form.data_vencimento_contrato ?? ''}
                  isReadOnly
                  bg="gray.100"
                  size="lg"
                  rounded="xl"
                  cursor="not-allowed"
                  _focus={{ boxShadow: 'none' }}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" pt={8}>
                <FormLabel fontSize="sm" fontWeight="600" mb={0}>
                  Notificação WhatsApp
                </FormLabel>
                <Switch
                  colorScheme="green"
                  isChecked={form.notificacao_whatsapp === 1}
                  onChange={(e) => handleChange('notificacao_whatsapp', e.target.checked ? 1 : 0)}
                />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Observação</FormLabel>
              <Textarea
                value={form.observacao ?? ''}
                onChange={(e) => handleChange('observacao', e.target.value)}
                placeholder="Observações sobre o aluno..."
                rounded="xl"
                bg="gray.50"
                rows={3}
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
            rounded="xl"
            px={8}
          >
            {aluno ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
