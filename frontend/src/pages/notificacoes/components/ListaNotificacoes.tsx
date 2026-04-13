import { VStack, Flex, Icon, Text, Skeleton, Divider } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import { type Notificacao, type TipoNotificacao } from '../../../contexts/NotificacoesContext'
import { tipoConfig, type FiltroTipo } from './tipoConfig'
import NotificacaoItem from './NotificacaoItem'

interface Props {
  loading: boolean
  filtro: FiltroTipo
  filtered: Notificacao[]
  lidasIds: Set<string>
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export default function ListaNotificacoes({ loading, filtro, filtered, lidasIds, onMarkAsRead, onDelete }: Props) {
  if (loading) {
    return (
      <VStack p={6} spacing={3}>
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} h="80px" w="full" rounded="xl" />
        ))}
      </VStack>
    )
  }

  if (filtered.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" py={16} px={8}>
        <Flex w={14} h={14} rounded="2xl" bg="gray.50" align="center" justify="center" mb={3}>
          <Icon as={FiCheckCircle} boxSize={6} color="gray.300" />
        </Flex>
        <Text fontSize="md" fontWeight="600" color="gray.400">
          {filtro === 'todas'
            ? 'Nenhuma notificação'
            : `Nenhuma notificação "${tipoConfig[filtro as TipoNotificacao]?.label}"`}
        </Text>
        <Text fontSize="sm" color="gray.300" mt={1}>Tudo em dia!</Text>
      </Flex>
    )
  }

  return (
    <VStack spacing={0} divider={<Divider borderColor="gray.50" />}>
      {filtered.map(n => (
        <NotificacaoItem
          key={n.id}
          notificacao={n}
          isRead={lidasIds.has(n.id)}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </VStack>
  )
}
