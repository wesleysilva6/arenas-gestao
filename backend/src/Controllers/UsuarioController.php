<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\UsuarioService;
use Exception;

class UsuarioController extends ControllerBase
{
    /**
     * Retorna dados do perfil do usuário logado
     */
    public function perfil(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $dados = UsuarioService::perfil($userId);

            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $dados,
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Atualiza nome e email do usuário logado
     */
    public function atualizarDados(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $body = $request->getParsedBody() ?: [];

            $nome = $body['nome'] ?? null;
            $email = $body['email'] ?? null;

            if (!$nome || !$email) {
                return $this->jsonResponse($response, [
                    'error' => 'Nome e email são obrigatórios',
                ], 400);
            }

            $dados = UsuarioService::atualizarDados($userId, $nome, $email);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Dados atualizados com sucesso',
                'data' => $dados,
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Verifica se a senha atual está correta
     */
    public function verificarSenha(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $body = $request->getParsedBody() ?: [];

            $senhaAtual = $body['senha_atual'] ?? null;

            if (!$senhaAtual) {
                return $this->jsonResponse($response, [
                    'error' => 'Senha atual é obrigatória',
                ], 400);
            }

            UsuarioService::verificarSenha($userId, $senhaAtual);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Senha verificada',
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'error' => $e->getMessage(),
            ], 401);
        }
    }

    /**
     * Altera a senha do usuário
     */
    public function alterarSenha(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $body = $request->getParsedBody() ?: [];

            $senhaAtual = $body['senha_atual'] ?? null;
            $novaSenha = $body['nova_senha'] ?? null;

            if (!$senhaAtual || !$novaSenha) {
                return $this->jsonResponse($response, [
                    'error' => 'Senha atual e nova senha são obrigatórias',
                ], 400);
            }

            UsuarioService::alterarSenha($userId, $senhaAtual, $novaSenha);

            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Senha alterada com sucesso',
            ]);
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
