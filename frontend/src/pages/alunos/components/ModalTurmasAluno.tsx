import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiCalendar, FiClock, FiLayers, FiUser } from 'react-icons/fi'
import { listarTurmasDoAluno, type Aluno, type TurmaDoAluno } from '../../../service/alunos'

interface Props {
  isOpen: boolean
  onClose: () => void
  aluno: Aluno | null
}

export default function ModalTurmasAluno({ isOpen, onClose, aluno }: Props) {
  const [turmas, setTurmas] = useState<TurmaDoAluno[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && aluno) {
      setLoading(true)
      listarTurmasDoAluno(aluno.idaluno)
        .then(setTurmas)
        .catch(() => setTurmas([]))
        .finally(() => setLoading(false))
    } else {
      setTurmas([])
    }
  }, [isOpen, aluno])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <ModalContent rounded="2xl" shadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.100" pb={4}>
          <Flex align="center" gap={3}>
            <Flex w={9} h={9} rounded="xl" bg="brand.50" align="center" justify="center">
              <Icon as={FiLayers} boxSize={4} color="brand.500" />
            </Flex>
            <Box>
              <Text fontSize="md" fontWeight="700" color="gray.800">Turmas do Aluno</Text>
              <Text fontSize="xs" color="gray.500" fontWeight="400">{aluno?.nome}</Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton top={4} />

        <ModalBody py={4} px={6}>
          {loading ? (
            <VStack spacing={3}>
              {[1, 2, 3].map((i) => <Skeleton key={i} h="72px" rounded="xl" w="full" />)}
            </VStack>
          ) : turmas.length === 0 ? (
            <Flex direction="column" align="center" justify="center" py={10} gap={2}>
              <Icon as={FiLayers} boxSize={10} color="gray.300" />
              <Text color="gray.400" fontSize="sm">Nenhuma turma associada</Text>
            </Flex>
          ) : (
            <VStack spacing={3} align="stretch" pb={2}>
              {turmas.map((turma) => (
                <Box
                  key={turma.idturma}
                  border="1px solid"
                  borderColor="gray.100"
                  rounded="xl"
                  p={4}
                  bg="gray.50"
                >
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Text fontSize="sm" fontWeight="700" color="gray.800">{turma.nome}</Text>
                    <Badge colorScheme="purple" rounded="full" px={2} fontSize="xs">
                      {turma.modalidade_nome}
                    </Badge>
                  </Flex>
                  <VStack align="flex-start" spacing={1}>
                    <Flex align="center" gap={2}>
                      <Icon as={FiCalendar} boxSize={3} color="gray.400" />
                      <Text fontSize="xs" color="gray.500">{turma.dias_semana}</Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={FiClock} boxSize={3} color="gray.400" />
                      <Text fontSize="xs" color="gray.500">{turma.horario}</Text>
                    </Flex>
                    {turma.professor && (
                      <Flex align="center" gap={2}>
                        <Icon as={FiUser} boxSize={3} color="gray.400" />
                        <Text fontSize="xs" color="gray.500">{turma.professor}</Text>
                      </Flex>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
