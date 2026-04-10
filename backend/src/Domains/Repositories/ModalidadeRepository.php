<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class ModalidadeRepository
{
    public static function listar(): array
    {
        $res = Database::switchParams([], 'modalidade/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function cadastrar(string $nome, int $situacao): array
    {
        $params = ['nome' => $nome, 'situacao' => $situacao];
        $res = Database::switchParams($params, 'modalidade/cadastrar', true);
        return $res['retorno'] ?? [];
    }

    public static function editar(int $idmodalidade, string $nome, int $situacao): array
    {
        $params = [
            'idmodalidade' => $idmodalidade,
            'nome' => $nome,
            'situacao' => $situacao,
        ];
        $res = Database::switchParams($params, 'modalidade/editar', true);
        return $res['retorno'] ?? [];
    }

    public static function toggleStatus(int $idmodalidade, int $situacao): array
    {
        $params = ['idmodalidade' => $idmodalidade, 'situacao' => $situacao];
        $res = Database::switchParams($params, 'modalidade/toggle_status', true);
        return $res['retorno'] ?? [];
    }
}
