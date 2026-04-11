<?php

namespace App\Domains\Services;

use App\Domains\Repositories\MensagemRepository;

class MensagemService
{
    // ── Grupos ──

    public static function listarGrupos(): array
    {
        return MensagemRepository::listarGrupos();
    }

    public static function cadastrarGrupo(array $dados): array
    {
        return MensagemRepository::cadastrarGrupo($dados);
    }

    public static function editarGrupo(array $dados): array
    {
        return MensagemRepository::editarGrupo($dados);
    }

    public static function deletarGrupo(int $id): array
    {
        return MensagemRepository::deletarGrupo($id);
    }

    // ── Mensagens ──

    public static function listarHistorico(): array
    {
        return MensagemRepository::listarHistorico();
    }

    public static function cadastrar(array $dados): array
    {
        return MensagemRepository::cadastrar($dados);
    }

    // ── Mapa ──

    public static function alunosTurmaMap(): array
    {
        return MensagemRepository::alunosTurmaMap();
    }
}
