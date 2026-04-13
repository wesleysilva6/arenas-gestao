<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class DashboardRepository
{
    public static function buscarStats(): array
    {
        $res = Database::switchParams([], 'dashboard/stats', true, false, '', 1);
        return $res['error'] ? [] : (array) $res['retorno'];
    }

    public static function buscarVencimentos(): array
    {
        $res = Database::switchParams([], 'dashboard/vencimentos', true);
        return $res['retorno'] ?: [];
    }

    public static function buscarTreinosHoje(): array
    {
        $res = Database::switchParams([], 'dashboard/treinos_hoje', true);
        return $res['retorno'] ?: [];
    }
}
