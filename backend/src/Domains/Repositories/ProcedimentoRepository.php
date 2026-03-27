<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class ProcedimentoRepository
{
    public static function Listar(): array
    {
        $res = Database::switchParams([], 'procedimento/listar', true, true);
        return $res['retorno'] ?? [];
    }

    public static function Cadastrar(
        string $descricao,
        string $situacao,
    ) {
        $params = [
            'descricao' => $descricao,
            'situacao' => $situacao
        ];

        $res = Database::switchParams($params, 'procedimento/cadastrar', true, true);
        return $res['retorno'] ?? [];
    }

    public static function Editar(
        int $idprocedimento,
        string $descricao,
        string $situacao,
    ): array {
        $params = [
            'idprocedimento' => $idprocedimento,
            'descricao' => $descricao,
            'situacao' => $situacao
        ];

        $res = Database::switchParams($params, 'procedimento/editar', true, true);
        return $res['retorno'] ?? [];
    }

    public static function Deletar(
        int $idprocedimento
    ): array {
        $params = [
            'idprocedimento' => $idprocedimento
        ];

        $res = Database::switchParams($params, 'procedimento/deletar', true, true);

        return $res['retorno'] ?? [];
    }
}
