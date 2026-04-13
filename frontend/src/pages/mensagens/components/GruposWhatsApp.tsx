import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import {
  FiEdit2,
  FiExternalLink,
  FiLink,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'
import { openGrupoLink, type GrupoWhatsApp } from '../../../service/mensagens'

interface Props {
  grupos: GrupoWhatsApp[]
  onNew: () => void
  onEdit: (g: GrupoWhatsApp) => void
  onDelete: (g: GrupoWhatsApp) => void
  deletingGrupo: GrupoWhatsApp | null
  isDeleteOpen: boolean
  onDeleteClose: () => void
  onConfirmDelete: () => void
}

export default function GruposWhatsApp({
  grupos, onNew, onEdit, onDelete,
  deletingGrupo, isDeleteOpen, onDeleteClose, onConfirmDelete,
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" shadow="sm" p={5} mb={5}>
        <Flex justify="space-between" align="center" mb={4}>
          <HStack>
            <Flex w={8} h={8} rounded="lg" bg="green.50" align="center" justify="center">
              <Icon as={FiLink} boxSize={4} color="green.600" />
            </Flex>
            <Text fontSize="sm" fontWeight="700" color="gray.700">Grupos WhatsApp</Text>
          </HStack>
          <Button size="xs" leftIcon={<FiPlus />} colorScheme="green" variant="ghost" onClick={onNew} rounded="lg">
            Adicionar
          </Button>
        </Flex>

        {grupos.length === 0 ? (
          <Box textAlign="center" py={6} px={4}>
            <Flex w={12} h={12} rounded="2xl" bg="gray.50" align="center" justify="center" mx="auto" mb={3}>
              <Icon as={FiLink} boxSize={5} color="gray.400" />
            </Flex>
            <Text fontSize="sm" color="gray.500" fontWeight="600">Nenhum grupo cadastrado</Text>
            <Text fontSize="xs" color="gray.400" mt={1}>Adicione links de grupos do WhatsApp para facilitar envios em massa.</Text>
          </Box>
        ) : (
          <VStack spacing={2} align="stretch">
            {grupos.map((g) => (
              <Flex
                key={g.id}
                p={3}
                rounded="xl"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.100"
                align="center"
                justify="space-between"
                _hover={{ bg: 'gray.100' }}
                transition="all 0.15s"
              >
                <Box flex={1} minW={0}>
                  <Text fontSize="sm" fontWeight="600" color="gray.800" isTruncated>{g.nome}</Text>
                  <Badge
                    mt={1}
                    colorScheme={g.tipo === 'turma' ? 'blue' : g.tipo === 'modalidade' ? 'purple' : 'green'}
                    rounded="full"
                    fontSize="2xs"
                    px={2}
                  >
                    {g.tipo === 'turma' ? 'Turma' : g.tipo === 'modalidade' ? 'Modalidade' : 'Geral'}
                  </Badge>
                </Box>
                <HStack spacing={0}>
                  <Tooltip label="Abrir grupo">
                    <IconButton
                      aria-label="Abrir"
                      icon={<FiExternalLink />}
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: 'green.500' }}
                      onClick={() => openGrupoLink(g.link)}
                    />
                  </Tooltip>
                  <Tooltip label="Editar">
                    <IconButton
                      aria-label="Editar"
                      icon={<FiEdit2 />}
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: 'blue.500' }}
                      onClick={() => onEdit(g)}
                    />
                  </Tooltip>
                  <Tooltip label="Remover">
                    <IconButton
                      aria-label="Remover"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: 'red.500' }}
                      onClick={() => onDelete(g)}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            ))}
          </VStack>
        )}
      </Box>

      {/* AlertDialog: Remover Grupo */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef as any} onClose={onDeleteClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent rounded="2xl">
            <AlertDialogHeader fontSize="lg" fontWeight="700" color="gray.800">
              Remover grupo
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              Tem certeza que deseja remover o grupo <b>{deletingGrupo?.nome}</b>?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" color="gray.500" onClick={onDeleteClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3} rounded="lg">Remover</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
