import { Button, Badge, HStack, IconButton, Tooltip } from '@chakra-ui/react'
import { FiCheck, FiRefreshCw } from 'react-icons/fi'
import { type FiltroTipo } from './tipoConfig'

interface Props {
  filtro: FiltroTipo
  onFiltroChange: (f: FiltroTipo) => void
  counts: Record<FiltroTipo, number>
  unreadCount: number
  loading: boolean
  onMarkAllAsRead: () => void
  onReload: () => void
}

const filterButtons: { key: FiltroTipo; label: string; color: string }[] = [
  { key: 'todas', label: 'Todas', color: 'gray' },
  { key: 'atraso', label: 'Em Atraso', color: 'red' },
  { key: 'vencimento', label: 'A Vencer', color: 'yellow' },
  { key: 'info', label: 'Informativo', color: 'green' },
]

export default function FiltroToolbar({
  filtro,
  onFiltroChange,
  counts,
  unreadCount,
  loading,
  onMarkAllAsRead,
  onReload,
}: Props) {
  return (
    <>
      <HStack spacing={2} wrap="wrap">
        {filterButtons.map(f => (
          <Button
            key={f.key}
            size="sm"
            rounded="xl"
            variant={filtro === f.key ? 'solid' : 'ghost'}
            colorScheme={filtro === f.key ? (f.key === 'todas' ? 'gray' : f.color) : 'gray'}
            onClick={() => onFiltroChange(f.key)}
            px={4}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <Badge
                ml={1.5}
                colorScheme={f.key === 'todas' ? 'gray' : f.color}
                rounded="full"
                fontSize="xs"
                px={1.5}
              >
                {counts[f.key]}
              </Badge>
            )}
          </Button>
        ))}
      </HStack>

      <HStack spacing={1}>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="brand"
            leftIcon={<FiCheck />}
            rounded="xl"
            onClick={onMarkAllAsRead}
          >
            Marcar todas
          </Button>
        )}
        <Tooltip label="Atualizar">
          <IconButton
            aria-label="Atualizar"
            icon={<FiRefreshCw />}
            size="sm"
            variant="ghost"
            rounded="xl"
            color="gray.400"
            isLoading={loading}
            onClick={onReload}
          />
        </Tooltip>
      </HStack>
    </>
  )
}
