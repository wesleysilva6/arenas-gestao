<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;
use RuntimeException;

class AlunoRepository
{
    private static function getArrayResult(array $res): array
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        return is_array($res['retorno'] ?? null) ? $res['retorno'] : [];
    }

    private static function getObjectResult(array $res): ?object
    {
        if (!empty($res['error'])) {
            throw new RuntimeException($res['error']);
        }

        return is_object($res['retorno'] ?? null) ? $res['retorno'] : null;
    }

    public static function listar(): array
    {
        $res = Database::switchParams([], 'aluno/listar', true);
        return self::getArrayResult($res);
    }

    public static function buscar(int $idaluno): ?object
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/buscar', true, false, '', 1);
        return self::getObjectResult($res);
    }

    public static function cadastrar(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/cadastrar', true);
        return self::getArrayResult($res);
    }

    public static function editar(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/editar', true);
        return self::getArrayResult($res);
    }

    public static function deletar(int $idaluno): array
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/deletar', true);
        return self::getArrayResult($res);
    }

    public static function listarModalidades(): array
    {
        $res = Database::switchParams([], 'aluno/modalidades', true);
        return self::getArrayResult($res);
    }

    public static function gerarMensalidade(array $dados): array
    {
        $res = Database::switchParams($dados, 'aluno/gerar_mensalidade', true);
        return self::getArrayResult($res);
    }

    public static function cancelar(int $idaluno): array
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/cancelar', true);
        return self::getArrayResult($res);
    }

    public static function cancelarMensalidades(int $aluno_id): array
    {
        $params = ['aluno_id' => $aluno_id];
        $res = Database::switchParams($params, 'aluno/cancelar_mensalidades', true);
        return self::getArrayResult($res);
    }

    public static function limparMensalidadesPendentes(int $aluno_id): array
    {
        $params = ['aluno_id' => $aluno_id];
        $res = Database::switchParams($params, 'aluno/limpar_mensalidades_pendentes', true);
        return self::getArrayResult($res);
    }

    public static function listarTurmas(int $idaluno): array
    {
        $params = ['idaluno' => $idaluno];
        $res = Database::switchParams($params, 'aluno/listar_turmas', true);
        return self::getArrayResult($res);
    }
}
