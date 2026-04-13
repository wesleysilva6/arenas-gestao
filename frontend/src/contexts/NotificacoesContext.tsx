import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { listarMensalidades, type Mensalidade, formatMesReferencia } from '../service/mensalidades'

// ── Tipos ───────────────────────────────────────────────────────────
export type TipoNotificacao = 'atraso' | 'vencimento' | 'info'

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  titulo: string
  descricao: string
  detalhe: string
  alunoNome: string
  valor?: number
  data: string          // ISO string p/ ordenação
  mensalidadeId: number
}

interface NotificacoesContextType {
  notificacoes: Notificacao[]
  loading: boolean
  lidasIds: Set<string>
  deletedIds: Set<string>
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotificacao: (id: string) => void
  reload: () => void
}

const STORAGE_KEY_READ = 'notifs_read'
const STORAGE_KEY_DELETED = 'notifs_deleted'

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}
function saveSet(key: string, s: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...s]))
}

// ── Gerador de notificações a partir de mensalidades ────────────────
function gerarNotificacoes(mensalidades: Mensalidade[]): Notificacao[] {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const notifs: Notificacao[] = []

  for (const m of mensalidades) {
    // Já paga → ignorar
    if (m.situacao === 1) continue

    const venc = new Date(m.data_vencimento + 'T00:00:00')
    const diffDias = Math.round((venc.getTime() - hoje.getTime()) / 86400000)
    const mesLabel = formatMesReferencia(m.mes_referencia)

    // Só notifica se venceu ou faltam até 5 dias para vencer
    if (diffDias > 5 && m.situacao !== 2) continue

    if (m.situacao === 2 || diffDias < 0) {
      // Atrasada
      const diasAtraso = Math.abs(diffDias)
      notifs.push({
        id: `atraso-${m.idmensalidade}`,
        tipo: 'atraso',
        titulo: `Mensalidade em atraso — ${mesLabel}`,
        descricao: `Venceu em ${venc.toLocaleDateString('pt-BR')}`,
        detalhe: `${diasAtraso} dia${diasAtraso !== 1 ? 's' : ''} de atraso`,
        alunoNome: m.aluno_nome,
        valor: m.valor,
        data: m.data_vencimento,
        mensalidadeId: m.idmensalidade,
      })
    } else if (diffDias >= 0 && diffDias <= 5) {
      // A vencer nos próximos 5 dias
      const label =
        diffDias === 0 ? 'Vence hoje'
          : diffDias === 1 ? 'Vence amanhã'
            : `Vence em ${diffDias} dias`
      notifs.push({
        id: `venc-${m.idmensalidade}`,
        tipo: 'vencimento',
        titulo: `Mensalidade a vencer — ${mesLabel}`,
        descricao: `Vencimento: ${venc.toLocaleDateString('pt-BR')}`,
        detalhe: label,
        alunoNome: m.aluno_nome,
        valor: m.valor,
        data: m.data_vencimento,
        mensalidadeId: m.idmensalidade,
      })
    }
  }

  // Ordenar: atrasos primeiro (mais antigo), depois vencimentos (mais próximo)
  notifs.sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === 'atraso' ? -1 : 1
    return new Date(a.data).getTime() - new Date(b.data).getTime()
  })

  return notifs
}

// ── Context ─────────────────────────────────────────────────────────
const NotificacoesContext = createContext<NotificacoesContextType | null>(null)

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const [lidasIds, setLidasIds] = useState<Set<string>>(() => loadSet(STORAGE_KEY_READ))
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => loadSet(STORAGE_KEY_DELETED))

  const fetchNotificacoes = useCallback(async () => {
    setLoading(true)
    try {
      const mensalidades = await listarMensalidades()
      const allNotifs = gerarNotificacoes(mensalidades)
      setNotificacoes(allNotifs)
    } catch (err) {
      console.error('Erro ao carregar notificações:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNotificacoes() }, [fetchNotificacoes])

  // Filtra deletadas
  const visibleNotifs = notificacoes.filter(n => !deletedIds.has(n.id))

  const unreadCount = visibleNotifs.filter(n => !lidasIds.has(n.id)).length

  const markAsRead = useCallback((id: string) => {
    setLidasIds(prev => {
      const next = new Set(prev)
      next.add(id)
      saveSet(STORAGE_KEY_READ, next)
      return next
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setLidasIds(prev => {
      const next = new Set(prev)
      visibleNotifs.forEach(n => next.add(n.id))
      saveSet(STORAGE_KEY_READ, next)
      return next
    })
  }, [visibleNotifs])

  const deleteNotificacao = useCallback((id: string) => {
    setDeletedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      saveSet(STORAGE_KEY_DELETED, next)
      return next
    })
  }, [])

  return (
    <NotificacoesContext.Provider value={{
      notificacoes: visibleNotifs,
      loading,
      lidasIds,
      deletedIds,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotificacao,
      reload: fetchNotificacoes,
    }}>
      {children}
    </NotificacoesContext.Provider>
  )
}

export function useNotificacoes(): NotificacoesContextType {
  const ctx = useContext(NotificacoesContext)
  if (!ctx) throw new Error('useNotificacoes deve ser usado dentro de NotificacoesProvider')
  return ctx
}
