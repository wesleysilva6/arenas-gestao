<?php

namespace App\Domains\Services;

use App\Domains\Repositories\ModalidadeRepository;

class ModalidadeService
{
    public static function listar(): array
    {
        return ModalidadeRepository::listar();
    }

    public static function cadastrar(array $dados): array
    {
        return ModalidadeRepository::cadastrar(
            $dados['nome'],
            (int) ($dados['situacao'] ?? 1)
        );
    }

    public static function editar(int $idmodalidade, array $dados): array
    {
        return ModalidadeRepository::editar(
            $idmodalidade,
            $dados['nome'],
            (int) ($dados['situacao'] ?? 1)
        );
    }

    public static function toggleStatus(int $idmodalidade, int $situacao): array
    {
        return ModalidadeRepository::toggleStatus($idmodalidade, $situacao);
    }
}
