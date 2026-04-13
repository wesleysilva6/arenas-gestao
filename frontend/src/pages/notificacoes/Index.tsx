import { useState } from 'react'
import { Box, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { FiAlertTriangle } from 'react-icons/fi'
import { useNotificacoes } from '../../contexts/NotificacoesContext'
import { type FiltroTipo } from './components/tipoConfig'
import ResumoCards from './components/ResumoCards'
import FiltroToolbar from './components/FiltroToolbar'
import ListaNotificacoes from './components/ListaNotificacoes'

export default function NotificacoesPage() {
  const {
    notificacoes,
    loading,
    lidasIds,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotificacao,
    reload,
  } = useNotificacoes()

  const [filtro, setFiltro] = useState<FiltroTipo>('todas')

  const filtered = filtro === 'todas' ? notificacoes : notificacoes.filter(n => n.tipo === filtro)

  const counts: Record<FiltroTipo, number> = {
    todas: notificacoes.length,
    atraso: notificacoes.filter(n => n.tipo === 'atraso').length,
    vencimento: notificacoes.filter(n => n.tipo === 'vencimento').length,
    info: notificacoes.filter(n => n.tipo === 'info').length,
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="900px" w="full" mx="auto">

      {/* ── Summary cards ─────────────────────────────────────────── */}
      <ResumoCards
        loading={loading}
        total={counts.todas}
        naoLidas={unreadCount}
        atraso={counts.atraso}
        vencimento={counts.vencimento}
      />

      {/* ── Main card ─────────────────────────────────────────────── */}
      <Box bg="white" rounded="2xl" border="1px solid" borderColor="gray.100" overflow="hidden">

        {/* Toolbar */}
        <Flex
          px={5}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.100"
          align="center"
          justify="space-between"
          gap={3}
          wrap="wrap"
        >
          <FiltroToolbar
            filtro={filtro}
            onFiltroChange={setFiltro}
            counts={counts}
            unreadCount={unreadCount}
            loading={loading}
            onMarkAllAsRead={markAllAsRead}
            onReload={reload}
          />
        </Flex>

        {/* List */}
        <ListaNotificacoes
          loading={loading}
          filtro={filtro}
          filtered={filtered}
          lidasIds={lidasIds}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotificacao}
        />

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <Flex px={5} py={3} borderTop="1px solid" borderColor="gray.50" justify="space-between" align="center">
            <Text fontSize="xs" color="gray.400">
              Exibindo {filtered.length} de {notificacoes.length} notificaç{notificacoes.length !== 1 ? 'ões' : 'ão'}
            </Text>
            {counts.atraso > 0 && (
              <HStack spacing={1}>
                <Icon as={FiAlertTriangle} boxSize={3} color="red.400" />
                <Text fontSize="xs" color="red.400" fontWeight="600">{counts.atraso} em atraso</Text>
              </HStack>
            )}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
