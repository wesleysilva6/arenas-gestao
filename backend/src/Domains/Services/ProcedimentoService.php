<?php

namespace App\Domains\Services;

use App\Domains\Repositories\ProcedimentoRepository;

class ProcedimentoService
{
    public static function Listar(array $filters): array
    {
        $dbFilters = [
            'descricao' => $filters['descricao'] ?? null,
            'situacao' => $filters['situacao'] ?? null,
        ];

        return ProcedimentoRepository::Listar($dbFilters);
    }

    public static function Cadastrar(
        string $descricao,
        string $situacao
    ): array {
        return ProcedimentoRepository::Cadastrar($descricao, $situacao);
    }

    public static function Editar(
        int $idprocedimento,
        string $descricao,
        string $situacao,
    ): array {
        return ProcedimentoRepository::Editar($idprocedimento, $descricao, $situacao);
    }

    public static function Deletar(
        int $idprocedimento
    ): array {
        return ProcedimentoRepository::Deletar($idprocedimento);
    }
}
