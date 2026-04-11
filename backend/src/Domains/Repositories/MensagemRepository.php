<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class MensagemRepository
{
    // ── Grupos WhatsApp ──

    public static function listarGrupos(): array
    {
        $res = Database::switchParams([], 'grupo_whatsapp/listar', true);
        return $res['retorno'] ?? [];
    }

    public static function cadastrarGrupo(array $dados): array
    {
        $res = Database::switchParams($dados, 'grupo_whatsapp/cadastrar', true);
        return $res['retorno'] ?? [];
    }

    public static function editarGrupo(array $dados): array
    {
        $res = Database::switchParams($dados, 'grupo_whatsapp/editar', true);
        return $res['retorno'] ?? [];
    }

    public static function deletarGrupo(int $id): array
    {
        $res = Database::switchParams(['id' => $id], 'grupo_whatsapp/deletar', true);
        return $res['retorno'] ?? [];
    }

    // ── Mensagens ──

    public static function listarHistorico(): array
    {
        $res = Database::switchParams([], 'mensagem/listar_historico', true);
        return $res['retorno'] ?? [];
    }

    public static function cadastrar(array $dados): array
    {
        $res = Database::switchParams($dados, 'mensagem/cadastrar', true);
        return $res['retorno'] ?? [];
    }

    // ── Mapa aluno↔turma ──

    public static function alunosTurmaMap(): array
    {
        $res = Database::switchParams([], 'mensagem/alunos_turma_map', true);
        return $res['retorno'] ?? [];
    }
}
