import { useEffect, useState } from 'react'
import { Box, SimpleGrid } from '@chakra-ui/react'
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiAlertTriangle,
  FiLayers,
  FiTrendingUp,
} from 'react-icons/fi'

import { formatCurrency } from '../../utils/formatters'
import type { Vencimento, Treino, StatCard } from '../../utils/types'
import { obterDashboard } from '../../service/dashboard'

import StatsGrid from './components/StatsGrid'
import TabelaVencimentos from './components/TabelaVencimentos'
import ListaTreinos from './components/ListaTreinos'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [proximosVencimentos, setProximosVencimentos] = useState<Vencimento[]>([])
  const [treinosHoje, setTreinosHoje] = useState<Treino[]>([])
  const [stats, setStats] = useState({
    total_alunos: 0,
    treinos_hoje: 0,
    receita_mes: 0,
    vencimentos_proximos: 0,
    modalidades_ativas: 0,
    novos_alunos_mes: 0,
  })

  const statCards: StatCard[] = [
    { label: 'Total de Alunos',     value: stats.total_alunos,                    icon: FiUsers,        color: 'brand.500', bg: 'brand.50'  },
    { label: 'Treinos Hoje',        value: stats.treinos_hoje,                    icon: FiCalendar,     color: 'green.500', bg: 'green.50'  },
    { label: 'Receita do Mês',      value: formatCurrency(stats.receita_mes),     icon: FiDollarSign,   color: 'teal.500',  bg: 'teal.50'   },
    { label: 'Vencimentos',         value: stats.vencimentos_proximos,            icon: FiAlertTriangle,color: 'orange.500',bg: 'orange.50' },
    { label: 'Modalidades Ativas',  value: stats.modalidades_ativas,              icon: FiLayers,       color: 'purple.500',bg: 'purple.50' },
    { label: 'Novos no Mês',        value: `+${stats.novos_alunos_mes}`,          icon: FiTrendingUp,   color: 'cyan.500',  bg: 'cyan.50'   },
  ]

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const data = await obterDashboard()
        setStats(data.stats)
        setProximosVencimentos(data.vencimentos ?? [])
        setTreinosHoje(data.treinos_hoje ?? [])
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} maxW="1400px" w="full" mx="auto">
      <StatsGrid cards={statCards} loading={loading} />

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <TabelaVencimentos vencimentos={proximosVencimentos} loading={loading} />
        <ListaTreinos treinos={treinosHoje} loading={loading} />
      </SimpleGrid>
    </Box>
  )
}