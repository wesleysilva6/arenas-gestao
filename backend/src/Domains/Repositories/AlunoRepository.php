<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class AlunoRepository
{
    public static function listar(): array
    {
        $res = Database::switchParams([], 'aluno/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function buscar(int $idaluno): ?object
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/buscar', true, false, '', 1);

        if (isset($res['error']) && $res['error']) {
            return null;
        }

        return $res['retorno'] ?? null;
    }

    public static function cadastrar(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/cadastrar', true);
        return $res['retorno'] ?? [];
    }

    public static function editar(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/editar', true);
        return $res['retorno'] ?? [];
    }

    public static function deletar(int $idaluno): array
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/deletar', true);
        return $res['retorno'] ?? [];
    }

    public static function listarModalidades(): array
    {
        $res = Database::switchParams([], 'aluno/modalidades', true);
        return $res['retorno'] ?? [];
    }

    public static function gerarMensalidade(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/gerar_mensalidade', true);
        return $res['retorno'] ?? [];
    }

    public static function cancelar(int $idaluno): array
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/cancelar', true);
        return $res['retorno'] ?? [];
    }

    public static function cancelarMensalidades(int $aluno_id): array
    {
        $params = ['aluno_id' => $aluno_id];
        $res = Database::switchParams($params, 'aluno/cancelar_mensalidades', true);
        return $res['retorno'] ?? [];
    }

    public static function limparMensalidadesPendentes(int $aluno_id): array
    {
        $params = ['aluno_id' => $aluno_id];
        $res = Database::switchParams($params, 'aluno/limpar_mensalidades_pendentes', true);
        return $res['retorno'] ?? [];
    }
}
