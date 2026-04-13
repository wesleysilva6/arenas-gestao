<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\GastoService;
use Exception;

class GastoController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            $data = GastoService::listar();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['descricao', 'valor', 'categoria', 'data']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = GastoService::cadastrar($body);
            return $this->successResponse($response, 'Gasto cadastrado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['descricao', 'valor', 'categoria', 'data']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = GastoService::editar($id, $body);
            return $this->successResponse($response, 'Gasto atualizado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function deletar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            GastoService::deletar($id);
            return $this->successResponse($response, 'Gasto excluído com sucesso!');
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function resumoMes(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $mesReferencia = $params['mes_referencia'] ?? null;

            if (!$mesReferencia || !preg_match('/^\d{4}-\d{2}$/', $mesReferencia)) {
                return $this->errorResponse($response, 'mes_referencia inválido. Use o formato YYYY-MM.');
            }

            $data = GastoService::resumoMes($mesReferencia);
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
