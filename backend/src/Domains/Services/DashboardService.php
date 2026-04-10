<?php

namespace App\Domains\Services;

use App\Domains\Repositories\DashboardRepository;

class DashboardService
{
    public static function obterDados(): array
    {
        $stats = DashboardRepository::buscarStats();
        $vencimentos = DashboardRepository::buscarVencimentos();
        $treinosHoje = DashboardRepository::buscarTreinosHoje();

        return [
            'stats' => [
                'total_alunos' => (int) ($stats['total_alunos'] ?? 0),
                'treinos_hoje' => (int) ($stats['treinos_hoje'] ?? 0),
                'receita_mes' => (float) ($stats['receita_mes'] ?? 0),
                'vencimentos_proximos' => (int) ($stats['vencimentos_proximos'] ?? 0),
                'modalidades_ativas' => (int) ($stats['modalidades_ativas'] ?? 0),
                'novos_alunos_mes' => (int) ($stats['novos_alunos_mes'] ?? 0),
            ],
            'vencimentos' => $vencimentos,
            'treinos_hoje' => $treinosHoje,
        ];
    }
}
