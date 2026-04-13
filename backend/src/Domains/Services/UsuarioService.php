<?php

namespace App\Domains\Services;

use App\Domains\Repositories\UsuarioRepository;
use Exception;

class UsuarioService
{
    /**
     * Retorna dados do perfil do usuário
     */
    public static function perfil(int $userId): array
    {
        $usuario = UsuarioRepository::buscarPorId($userId);

        if (!$usuario) {
            throw new Exception('Usuário não encontrado');
        }

        return [
            'idusuario' => $usuario->idusuario,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'situacao' => $usuario->situacao,
        ];
    }

    /**
     * Atualiza nome e email do usuário
     */
    public static function atualizarDados(int $userId, string $nome, string $email): array
    {
        if (strlen(trim($nome)) < 2) {
            throw new Exception('O nome deve ter pelo menos 2 caracteres');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Informe um e-mail válido');
        }

        $ok = UsuarioRepository::atualizarDados($userId, trim($nome), trim($email));

        if (!$ok) {
            throw new Exception('Erro ao atualizar dados');
        }

        $usuario = UsuarioRepository::buscarPorId($userId);

        return [
            'idusuario' => $usuario->idusuario,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'situacao' => $usuario->situacao,
        ];
    }

    /**
     * Verifica se a senha atual está correta
     */
    public static function verificarSenha(int $userId, string $senhaAtual): bool
    {
        $senhaHash = UsuarioRepository::buscarSenha($userId);

        if (!$senhaHash) {
            throw new Exception('Usuário não encontrado');
        }

        if (!password_verify($senhaAtual, $senhaHash)) {
            throw new Exception('Senha atual incorreta');
        }

        return true;
    }

    /**
     * Altera a senha do usuário (após verificação da senha atual)
     */
    public static function alterarSenha(int $userId, string $senhaAtual, string $novaSenha): void
    {
        if (strlen($novaSenha) < 6) {
            throw new Exception('A nova senha deve ter pelo menos 6 caracteres');
        }

        // Verificar senha atual
        self::verificarSenha($userId, $senhaAtual);

        // Hash da nova senha
        $novaHash = password_hash($novaSenha, PASSWORD_BCRYPT);

        $ok = UsuarioRepository::atualizarSenha($userId, $novaHash);

        if (!$ok) {
            throw new Exception('Erro ao alterar senha');
        }
    }
}
