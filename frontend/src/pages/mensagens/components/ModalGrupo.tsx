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
  Text,
  VStack,
} from '@chakra-ui/react'
import type { TurmaMsg, ModalidadeMsg } from '../../../service/mensagens'
import { inputStyle } from './templates'

export interface GrupoFormData {
  nome: string
  link: string
  tipo: 'turma' | 'modalidade' | 'geral'
  referencia_id: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  form: GrupoFormData
  setForm: (f: GrupoFormData) => void
  turmas: TurmaMsg[]
  modalidades: ModalidadeMsg[]
  salvando: boolean
  onSave: () => void
}

export default function ModalGrupo({
  isOpen, onClose, isEditing,
  form, setForm,
  turmas, modalidades,
  salvando, onSave,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent rounded="2xl">
        <ModalHeader color="gray.800" fontSize="lg" fontWeight="700">
          {isEditing ? 'Editar Grupo' : 'Novo Grupo WhatsApp'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={2}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">Nome do grupo</FormLabel>
              <Input
                placeholder="Ex: Beach Tennis — Avançado"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                {...inputStyle}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">Link do grupo</FormLabel>
              <Input
                placeholder="https://chat.whatsapp.com/..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                {...inputStyle}
              />
              <Text fontSize="xs" color="gray.400" mt={1}>
                No WhatsApp: Grupo → Configurações → Link de convite → Copiar
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Tipo</FormLabel>
              <Select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as any, referencia_id: '' })}
                {...inputStyle}
              >
                <option value="geral">Geral</option>
                <option value="turma">Turma</option>
                <option value="modalidade">Modalidade</option>
              </Select>
            </FormControl>
            {form.tipo === 'turma' && (
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">Turma vinculada</FormLabel>
                <Select
                  placeholder="Selecione"
                  value={form.referencia_id}
                  onChange={(e) => setForm({ ...form, referencia_id: e.target.value })}
                  {...inputStyle}
                >
                  {turmas.map((t) => (
                    <option key={t.idturma} value={t.idturma}>{t.nome}</option>
                  ))}
                </Select>
              </FormControl>
            )}
            {form.tipo === 'modalidade' && (
              <FormControl>
                <FormLabel fontSize="sm" color="gray.600">Modalidade vinculada</FormLabel>
                <Select
                  placeholder="Selecione"
                  value={form.referencia_id}
                  onChange={(e) => setForm({ ...form, referencia_id: e.target.value })}
                  {...inputStyle}
                >
                  {modalidades.map((m) => (
                    <option key={m.idmodalidade} value={m.idmodalidade}>{m.nome}</option>
                  ))}
                </Select>
              </FormControl>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} color="gray.500">Cancelar</Button>
          <Button
            colorScheme="green"
            onClick={onSave}
            isLoading={salvando}
            rounded="lg"
            fontWeight="700"
          >
            {isEditing ? 'Salvar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
