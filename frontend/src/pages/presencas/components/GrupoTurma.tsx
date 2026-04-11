import { useState } from 'react'
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Checkbox,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FiClock, FiMapPin, FiUser } from 'react-icons/fi'
import type { TurmaPresenca, Presenca, AulaAgrupada } from '../../../service/presencas'
import {
  agruparPorData,
  formatDataAula,
  formatHorario,
  isHoje,
  isFutura,
} from '../../../service/presencas'

interface Props {
  turma: TurmaPresenca
  onMarcar: (idpresenca: number, situacao: number) => Promise<void>
}

function ListaAula({
  aula,
  onMarcar,
}: {
  aula: AulaAgrupada
  onMarcar: (idpresenca: number, situacao: number) => Promise<void>
}) {
  const [marcando, setMarcando] = useState<Set<number>>(new Set())
  const hoje = isHoje(aula.data_treino)
  const futura = isFutura(aula.data_treino)
  const presentes = aula.presencas.filter((p) => p.situacao === 1).length

  async function handleToggle(p: Presenca) {
    const novo = p.situacao === 1 ? 0 : 1
    setMarcando((prev) => new Set(prev).add(p.idpresenca))
    try {
      await onMarcar(p.idpresenca, novo)
    } finally {
      setMarcando((prev) => {
        const s = new Set(prev)
        s.delete(p.idpresenca)
        return s
      })
    }
  }

  const borderColor = hoje ? 'brand.200' : futura ? 'purple.200' : 'gray.100'
  const headerBg = hoje ? 'brand.50' : futura ? 'purple.50' : 'gray.50'

  return (
    <Box border="1px solid" borderColor={borderColor} rounded="xl" mb={3} overflow="hidden">
      <Flex px={4} py={3} bg={headerBg} align="center" justify="space-between">
        <HStack spacing={2} flexWrap="wrap">
          {hoje && (
            <Badge colorScheme="brand" rounded="full" fontSize="xs">
              Hoje
            </Badge>
          )}
          {futura && (
            <Badge colorScheme="purple" rounded="full" fontSize="xs">
              Próxima aula
            </Badge>
          )}
          <Text fontWeight="600" fontSize="sm" color="gray.700">
            {formatDataAula(aula.data_treino)}
          </Text>
        </HStack>
        <Badge
          colorScheme={
            presentes === aula.presencas.length && aula.presencas.length > 0
              ? 'green'
              : presentes > 0
              ? 'yellow'
              : 'gray'
          }
          rounded="full"
          fontSize="xs"
          flexShrink={0}
        >
          {presentes}/{aula.presencas.length} presentes
        </Badge>
      </Flex>

      <VStack spacing={0} align="stretch" px={4} py={2}>
        {aula.presencas.map((p, idx) => (
          <Flex
            key={p.idpresenca}
            align="center"
            py={2.5}
            borderBottom={idx < aula.presencas.length - 1 ? '1px solid' : 'none'}
            borderColor="gray.50"
            gap={3}
          >
            {marcando.has(p.idpresenca) ? (
              <Spinner size="sm" color="green.400" flexShrink={0} />
            ) : (
              <Checkbox
                isChecked={p.situacao === 1}
                onChange={() => handleToggle(p)}
                colorScheme="green"
                flexShrink={0}
              />
            )}
            <Avatar size="xs" name={p.aluno_nome} bg="brand.100" color="brand.700" flexShrink={0} />
            <Text
              fontSize="sm"
              fontWeight={p.situacao === 1 ? '600' : '400'}
              color={p.situacao === 1 ? 'gray.800' : 'gray.400'}
              flex="1"
            >
              {p.aluno_nome}
            </Text>
            {p.situacao === 1 && (
              <Badge colorScheme="green" rounded="full" fontSize="xs" variant="subtle">
                Presente
              </Badge>
            )}
          </Flex>
        ))}
      </VStack>
    </Box>
  )
}

export default function GrupoTurma({ turma, onMarcar }: Props) {
  const aulas = agruparPorData(turma.presencas)
  const hoje = new Date().toISOString().slice(0, 10)
  const aulaHoje = aulas.find((a) => a.data_treino === hoje)
  const presentesHoje = aulaHoje ? aulaHoje.presencas.filter((p) => p.situacao === 1).length : null
  const totalHoje = aulaHoje ? aulaHoje.presencas.length : null

  return (
    <AccordionItem
      bg="white"
      rounded="2xl"
      shadow="sm"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
    >
      <AccordionButton px={5} py={4} _hover={{ bg: 'gray.50' }}>
        <HStack flex="1" spacing={4} minW={0}>
          <Box textAlign="left" flex="1" minW={0}>
            <HStack spacing={2} flexWrap="wrap">
              <Text fontWeight="700" fontSize="sm" color="gray.800">
                {turma.nome}
              </Text>
              <Badge colorScheme="brand" variant="subtle" rounded="full" fontSize="xs">
                {turma.modalidade_nome}
              </Badge>
            </HStack>
            <HStack spacing={3} mt={0.5} flexWrap="wrap">
              <HStack spacing={1}>
                <Icon as={FiClock} boxSize={3} color="gray.400" />
                <Text fontSize="xs" color="gray.400">
                  {formatHorario(turma.horario)}
                </Text>
              </HStack>
              <HStack spacing={1}>
                <Icon as={FiMapPin} boxSize={3} color="gray.400" />
                <Text fontSize="xs" color="gray.400">
                  {turma.dias_semana}
                </Text>
              </HStack>
              {turma.professor && (
                <HStack spacing={1}>
                  <Icon as={FiUser} boxSize={3} color="gray.400" />
                  <Text fontSize="xs" color="gray.400">
                    {turma.professor}
                  </Text>
                </HStack>
              )}
            </HStack>
          </Box>

          <HStack spacing={2} flexShrink={0} mr={2}>
            {aulaHoje !== undefined && (
              <Badge
                colorScheme={
                  presentesHoje === totalHoje && totalHoje! > 0
                    ? 'green'
                    : presentesHoje! > 0
                    ? 'yellow'
                    : 'gray'
                }
                rounded="full"
                fontSize="xs"
              >
                Hoje: {presentesHoje}/{totalHoje}
              </Badge>
            )}
            <Badge colorScheme="gray" rounded="full" fontSize="xs" variant="subtle">
              {turma.alunos_count} aluno{Number(turma.alunos_count) !== 1 ? 's' : ''}
            </Badge>
          </HStack>
        </HStack>
        <AccordionIcon color="gray.400" />
      </AccordionButton>

      <AccordionPanel px={5} pt={2} pb={4}>
        {aulas.length === 0 ? (
          <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
            Nenhuma aula registrada neste período.
          </Text>
        ) : (
          aulas.map((aula) => (
            <ListaAula key={aula.data_treino} aula={aula} onMarcar={onMarcar} />
          ))
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}
