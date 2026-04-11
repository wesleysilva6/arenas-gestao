<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class MensalidadeRepository
{
    public static function listar(): array
    {
        Database::switchParams([], 'mensalidade/atualizar_vencidas', true);
        $res = Database::switchParams([], 'mensalidade/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function confirmarPagamento(int $idmensalidade): array
    {
        $params = ['idmensalidade' => $idmensalidade];
        $res = Database::switchParams($params, 'mensalidade/confirmar_pagamento', true);
        return $res['retorno'] ?? [];
    }

    public static function alunosSemMensalidade(string $mesReferencia): array
    {
        $params = ['mes_referencia' => $mesReferencia];
        $res = Database::switchParams($params, 'mensalidade/alunos_sem_mensalidade', true);
        return $res['retorno'] ?? [];
    }

    public static function gerarMensalidade(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/gerar_mensalidade', true);
        return $res['retorno'] ?? [];
    }
}
