<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\LoginService;
use Exception;

class LoginController extends ControllerBase
{
    /**
     * Realiza login do usuário
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function login(Request $request, Response $response): Response
    {
        try {
            $body = $request->getParsedBody() ?: [];
            
            // Validar campos obrigatórios
            $email = $body['email'] ?? $body['login'] ?? null;
            $senha = $body['senha'] ?? $body['password'] ?? null;
            
            if (!$email || !$senha) {
                return $this->jsonResponse($response, [
                    'error' => 'Email e senha são obrigatórios'
                ], 400);
            }
            
            // Autenticar usuário
            $data = LoginService::autenticar($email, $senha);
            
            return $this->jsonResponse($response, [
                'success' => true,
                'message' => 'Login realizado com sucesso',
                'data' => $data
            ]);
            
        } catch (Exception $e) {
            return $this->jsonResponse($response, [
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
