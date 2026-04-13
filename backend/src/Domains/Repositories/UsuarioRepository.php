<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class UsuarioRepository
{
    /**
     * Busca usuário por ID
     */
    public static function buscarPorId(int $id): ?object
    {
        $params = ['idusuario' => $id];
        $res = Database::switchParams($params, 'usuario/buscar_por_id', true, false, '', 1);

        if (isset($res['error']) && $res['error']) {
            return null;
        }

        return $res['retorno'] ?: null;
    }

    /**
     * Busca a senha hash do usuário
     */
    public static function buscarSenha(int $id): ?string
    {
        $params = ['idusuario' => $id];
        $res = Database::switchParams($params, 'usuario/buscar_senha', true, false, '', 1);

        if (isset($res['error']) && $res['error']) {
            return null;
        }

        return $res['retorno']->senha ?? null;
    }

    /**
     * Atualiza nome e email do usuário
     */
    public static function atualizarDados(int $id, string $nome, string $email): bool
    {
        $params = [
            'idusuario' => $id,
            'nome' => $nome,
            'email' => $email,
        ];
        $res = Database::switchParams($params, 'usuario/atualizar_dados', true);

        return !isset($res['error']) || !$res['error'];
    }

    /**
     * Atualiza a senha do usuário
     */
    public static function atualizarSenha(int $id, string $senhaHash): bool
    {
        $params = [
            'idusuario' => $id,
            'senha' => $senhaHash,
        ];
        $res = Database::switchParams($params, 'usuario/atualizar_senha', true);

        return !isset($res['error']) || !$res['error'];
    }
}
