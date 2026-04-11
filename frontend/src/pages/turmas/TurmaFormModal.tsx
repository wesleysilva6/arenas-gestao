import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxGroup,
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
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { cadastrarTurma, editarTurma, type TurmaForm } from '../../service/turmas'
import { listarModalidades } from '../../service/modalidades'

export type TurmaData = {
  idturma?: number
  nome: string
  modalidade_id: number | string
  dias_semana: string
  horario: string
  professor: string
  limite_alunos: number | string
  situacao: number
}

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

interface Props {
  isOpen: boolean
  onClose: () => void
  turma: TurmaData | null
  onSaved: () => void
}

export default function TurmaFormModal({ isOpen, onClose, turma, onSaved }: Props) {
  const [salvando, setSalvando] = useState(false)
  const [modalidades, setModalidades] = useState<{ idmodalidade: number; nome: string }[]>([])
  const [form, setForm] = useState<TurmaData>({
    nome: '',
    modalidade_id: '',
    dias_semana: '',
    horario: '',
    professor: '',
    limite_alunos: '',
    situacao: 1,
  })
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([])

  useEffect(() => {
    listarModalidades().then((data) =>
      setModalidades(data.map((m) => ({ idmodalidade: m.idmodalidade, nome: m.nome })))
    )
  }, [])

  useEffect(() => {
    if (turma) {
      setForm({ ...turma })
      setDiasSelecionados(turma.dias_semana ? turma.dias_semana.split(', ').filter(Boolean) : [])
    } else {
      setForm({ nome: '', modalidade_id: '', dias_semana: '', horario: '', professor: '', limite_alunos: '', situacao: 1 })
      setDiasSelecionados([])
    }
  }, [turma, isOpen])

  const handleChange = (field: keyof TurmaData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDiasChange = (values: string[]) => {
    // Maintain order based on DIAS array
    const ordered = DIAS.filter((d) => values.includes(d))
    setDiasSelecionados(ordered)
  }

  const isValid =
    form.nome.trim() !== '' &&
    form.modalidade_id !== '' &&
    diasSelecionados.length > 0 &&
    form.horario !== ''

  const handleSubmit = async () => {
    if (!isValid) return
    setSalvando(true)
    try {
      const payload: TurmaForm = {
        nome: form.nome.trim(),
        modalidade_id: Number(form.modalidade_id),
        dias_semana: diasSelecionados.join(', '),
        horario: form.horario,
        professor: form.professor || null,
        limite_alunos: form.limite_alunos !== '' ? Number(form.limite_alunos) : null,
        situacao: form.situacao,
      }

      if (turma?.idturma) {
        await editarTurma(turma.idturma, payload)
      } else {
        await cadastrarTurma(payload)
      }

      onSaved()
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" mx={4}>
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">
          {turma?.idturma ? 'Editar Turma' : 'Nova Turma'}
        </ModalHeader>
        <ModalCloseButton rounded="xl" />

        <ModalBody pb={2}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Nome da Turma</FormLabel>
              <Input
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: Turma A - Manhã"
                rounded="xl"
                bg="gray.50"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Modalidade</FormLabel>
              <Select
                value={form.modalidade_id}
                onChange={(e) => handleChange('modalidade_id', e.target.value)}
                placeholder="Selecione a modalidade"
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

            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="600">Dias da Semana</FormLabel>
              <CheckboxGroup value={diasSelecionados} onChange={(vals) => handleDiasChange(vals as string[])}>
                <Wrap spacing={2}>
                  {DIAS.map((dia) => (
                    <WrapItem key={dia}>
                      <Checkbox
                        value={dia}
                        colorScheme="brand"
                        rounded="md"
                        borderColor="gray.300"
                      >
                        {dia}
                      </Checkbox>
                    </WrapItem>
                  ))}
                </Wrap>
              </CheckboxGroup>
            </FormControl>

            <SimpleGrid columns={2} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Horário</FormLabel>
                <Input
                  type="time"
                  value={form.horario}
                  onChange={(e) => handleChange('horario', e.target.value)}
                  rounded="xl"
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Limite de Alunos</FormLabel>
                <NumberInput
                  min={1}
                  value={form.limite_alunos !== '' ? Number(form.limite_alunos) : undefined}
                  onChange={(_, val) => handleChange('limite_alunos', isNaN(val) ? '' : val)}
                >
                  <NumberInputField placeholder="Sem limite" rounded="xl" bg="gray.50" />
                </NumberInput>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Professor</FormLabel>
              <Input
                value={form.professor}
                onChange={(e) => handleChange('professor', e.target.value)}
                placeholder="Nome do professor (opcional)"
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
            isDisabled={!isValid}
            rounded="xl"
            px={8}
          >
            {turma?.idturma ? 'Salvar' : 'Criar Turma'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
