<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\ModalidadeService;
use Exception;

class ModalidadeController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            $data = ModalidadeService::listar();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = ModalidadeService::cadastrar($body);
            return $this->successResponse($response, 'Modalidade cadastrada com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = ModalidadeService::editar($id, $body);
            return $this->successResponse($response, 'Modalidade atualizada com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function toggleStatus(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $situacao = (int) ($body['situacao'] ?? 0);
            $data = ModalidadeService::toggleStatus($id, $situacao);

            $msg = $situacao === 1 ? 'Modalidade reativada' : 'Modalidade desativada';
            return $this->successResponse($response, $msg, $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
