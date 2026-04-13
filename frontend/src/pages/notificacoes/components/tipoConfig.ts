import { type TipoNotificacao } from '../../../contexts/NotificacoesContext'
import { FiAlertTriangle, FiClock, FiInfo } from 'react-icons/fi'

export const tipoConfig: Record<TipoNotificacao, {
  label: string
  iconBg: string
  iconColor: string
  badgeColor: string
  icon: React.ElementType
}> = {
  atraso: { label: 'Em Atraso', iconBg: 'red.50', iconColor: 'red.500', badgeColor: 'red', icon: FiAlertTriangle },
  vencimento: { label: 'A Vencer', iconBg: 'yellow.50', iconColor: 'yellow.600', badgeColor: 'yellow', icon: FiClock },
  info: { label: 'Informativo', iconBg: 'brand.50', iconColor: 'brand.500', badgeColor: 'green', icon: FiInfo },
}

export type FiltroTipo = 'todas' | TipoNotificacao
