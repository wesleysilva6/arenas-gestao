<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class PresencaRepository
{
    public static function gerarAulas(array $params): void
    {
        Database::switchParams($params, 'presenca/gerar_aulas', true);
    }

    public static function listar(int $turmaId, string $dataInicio, string $dataFim): array
    {
        $params = [
            'turma_id'    => $turmaId,
            'data_inicio' => $dataInicio,
            'data_fim'    => $dataFim,
        ];
        $res = Database::switchParams($params, 'presenca/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function marcar(int $idpresenca, int $situacao): array
    {
        $params = [
            'idpresenca' => $idpresenca,
            'situacao'   => $situacao,
        ];
        $res = Database::switchParams($params, 'presenca/marcar', true);
        return $res['retorno'] ?? [];
    }

    public static function listarPorAluno(int $alunoId): array
    {
        $params = ['aluno_id' => $alunoId];
        $res = Database::switchParams($params, 'presenca/listar_por_aluno', true);
        return $res['retorno'] ?? [];
    }
}
