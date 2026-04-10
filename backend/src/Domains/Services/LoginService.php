<?php

namespace App\Domains\Services;

use App\Domains\Repositories\LoginRepository;
use Firebase\JWT\JWT;
use Exception;

class LoginService
{
    /**
     * Autentica usuário e retorna dados com token JWT
     * @param string $email
     * @param string $senha
     * @return array
     * @throws Exception
     */
    public static function autenticar(string $email, string $senha): array
    {
        // Buscar usuário por email
        $usuario = LoginRepository::buscarPorEmail($email);
        
        if (!$usuario) {
            throw new Exception('Email ou senha inválidos');
        }
        
        // Verificar senha
        if (!password_verify($senha, $usuario->senha)) {
            throw new Exception('Email ou senha inválidos');
        }
        
        // Verificar se usuário está ativo (1 = Ativo)
        if ($usuario->situacao !== 1) {
            throw new Exception('Usuário inativo');
        }
        
        // Gerar token JWT
        $tokenData = [
            'iss' => $_ENV['APP_NAME'] ?? 'API',
            'sub' => $usuario->idusuario,
            'iat' => time(),
            'exp' => time() + 86400, // 24 horas
            'email' => $usuario->email,
            'nome' => $usuario->nome
        ];
        
        $token = JWT::encode($tokenData, $_ENV['JWT_SECRET'], 'HS256');
        
        // Converter objeto para array e remover senha
        $usuarioArray = [
            'idusuario' => $usuario->idusuario,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'situacao' => $usuario->situacao,
            'criado_em' => $usuario->criado_em ?? null
        ];
        
        return [
            'token' => $token,
            'expires_in' => 86400,
            'auth_user' => $usuarioArray
        ];
    }
}
