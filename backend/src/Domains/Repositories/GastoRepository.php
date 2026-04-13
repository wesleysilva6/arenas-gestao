<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class GastoRepository
{
    public static function listar(): array
    {
        $res = Database::switchParams([], 'gasto/listar', true);
        return $res['retorno'] ?: [];
    }

    public static function cadastrar(array $dados): array
    {
        $res = Database::switchParams($dados, 'gasto/cadastrar', true);
        return $res['retorno'] ?: [];
    }

    public static function editar(array $dados): array
    {
        $res = Database::switchParams($dados, 'gasto/editar', true);
        return $res['retorno'] ?: [];
    }

    public static function deletar(int $id): bool
    {
        $res = Database::switchParams(['idgasto' => $id], 'gasto/deletar', true);
        return !isset($res['error']) || !$res['error'];
    }

    public static function resumoMes(string $mesReferencia): array
    {
        $res = Database::switchParams(['mes_referencia' => $mesReferencia], 'gasto/resumo_mes', true);
        return $res['retorno'] ?: [];
    }
}
