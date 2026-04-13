import {
  Box,
  Flex,
  Text,
  HStack,
  Icon,
  IconButton,
  Button,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import {
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiChevronRight,
  FiCheck,
  FiX,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { type Notificacao } from '../../../contexts/NotificacoesContext'
import { formatCurrency } from '../../../utils/formatters'
import { tipoConfig } from './tipoConfig'

interface Props {
  notificacao: Notificacao
  isRead: boolean
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export default function NotificacaoItem({ notificacao: n, isRead, onMarkAsRead, onDelete }: Props) {
  const navigate = useNavigate()
  const config = tipoConfig[n.tipo]

  return (
    <Flex
      w="full"
      px={5}
      py={4}
      align="center"
      gap={4}
      bg={isRead ? 'transparent' : 'brand.50'}
      _hover={{ bg: isRead ? 'gray.50' : 'brand.50' }}
      transition="background 0.15s"
      position="relative"
    >
      {/* Unread dot */}
      {!isRead && (
        <Box
          position="absolute"
          left="14px"
          top="50%"
          transform="translateY(-50%)"
          w="8px"
          h="8px"
          rounded="full"
          bg="brand.500"
          flexShrink={0}
        />
      )}

      {/* Type icon */}
      <Flex
        w={10}
        h={10}
        rounded="xl"
        bg={config.iconBg}
        align="center"
        justify="center"
        flexShrink={0}
        ml={isRead ? 0 : 2}
      >
        <Icon as={config.icon} boxSize={4.5} color={config.iconColor} />
      </Flex>

      {/* Content */}
      <Box flex={1} minW={0}>
        <HStack spacing={2} mb={0.5} wrap="wrap">
          <Text fontSize="sm" fontWeight={isRead ? '500' : '700'} color={isRead ? 'gray.600' : 'gray.800'}>
            {n.titulo}
          </Text>
          <Badge colorScheme={config.badgeColor} rounded="full" px={2} fontSize="xs" fontWeight="600">
            {config.label}
          </Badge>
          {!isRead && (
            <Badge colorScheme="brand" rounded="full" px={2} fontSize="xs" variant="subtle">
              Nova
            </Badge>
          )}
        </HStack>

        <HStack spacing={1.5} mb={0.5}>
          <Icon as={FiUser} boxSize={3} color="gray.400" />
          <Text fontSize="sm" fontWeight="600" color="gray.600" noOfLines={1}>
            {n.alunoNome}
          </Text>
        </HStack>

        <HStack spacing={3} wrap="wrap">
          <HStack spacing={1}>
            <Icon as={FiCalendar} boxSize={3} color="gray.400" />
            <Text fontSize="xs" color="gray.400">{n.descricao}</Text>
          </HStack>
          {n.valor !== undefined && (
            <HStack spacing={1}>
              <Icon as={FiDollarSign} boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" fontWeight="600">
                {formatCurrency(Number(n.valor))}
              </Text>
            </HStack>
          )}
        </HStack>
      </Box>

      {/* Right actions */}
      <Flex direction="column" align="flex-end" gap={1.5} flexShrink={0}>
        <Badge
          colorScheme={config.badgeColor}
          variant="subtle"
          rounded="full"
          px={2.5}
          py={0.5}
          fontSize="xs"
          fontWeight="700"
        >
          {n.detalhe}
        </Badge>

        <HStack spacing={1}>
          {!isRead && (
            <Tooltip label="Marcar como lida">
              <IconButton
                aria-label="Marcar como lida"
                icon={<FiCheck />}
                size="xs"
                variant="ghost"
                colorScheme="green"
                rounded="lg"
                onClick={() => onMarkAsRead(n.id)}
              />
            </Tooltip>
          )}
          <Tooltip label="Excluir notificação">
            <IconButton
              aria-label="Excluir"
              icon={<FiX />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              rounded="lg"
              onClick={() => onDelete(n.id)}
            />
          </Tooltip>
          <Button
            size="xs"
            variant="ghost"
            colorScheme="brand"
            rightIcon={<FiChevronRight />}
            rounded="lg"
            onClick={() => navigate('/mensalidades')}
          >
            Ver
          </Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
