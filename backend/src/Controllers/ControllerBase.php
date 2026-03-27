<?php

namespace App\Controllers;

use App\Infrastructures\Config\Database as DB;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ControllerBase extends DB
{
    /**
     * Retorna uma resposta JSON padronizada
     */
    protected function jsonResponse(Response $response, array $data, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    /**
     * Retorna uma resposta de sucesso
     */
    protected function successResponse(Response $response, string $message, array $data = [], int $status = 200): Response
    {
        $result = ['message' => $message];
        if (!empty($data)) {
            $result['data'] = $data;
        }
        return $this->jsonResponse($response, $result, $status);
    }

    /**
     * Retorna uma resposta de erro
     */
    protected function errorResponse(Response $response, string $message, int $status = 400, array $data = []): Response
    {
        $result = ['error' => $message];
        if (!empty($data)) {
            $result['data'] = $data;
        }
        return $this->jsonResponse($response, $result, $status);
    }

    /**
     * Pega o body da request como array
     */
    protected function getRequestBody(Request $request): array
    {
        return json_decode((string)$request->getBody(), true) ?? [];
    }

    /**
     * Valida se todos os campos obrigatórios estão presentes
     */
    protected function validateRequired(array $data, array $requiredFields): ?string
    {
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === null || $data[$field] === '') {
                return "Campo '{$field}' é obrigatório";
            }
        }
        return null;
    }
}
