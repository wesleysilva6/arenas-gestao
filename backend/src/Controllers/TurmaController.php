<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\TurmaService;
use Exception;

class TurmaController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            $data = TurmaService::listar();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        try {
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome', 'modalidade_id', 'dias_semana', 'horario']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = TurmaService::cadastrar($body);
            return $this->successResponse($response, 'Turma cadastrada com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function editar(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['nome', 'modalidade_id', 'dias_semana', 'horario']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            $data = TurmaService::editar($id, $body);
            return $this->successResponse($response, 'Turma atualizada com sucesso!', $data);
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
            $data = TurmaService::toggleStatus($id, $situacao);

            $msg = $situacao === 1 ? 'Turma reativada' : 'Turma desativada';
            return $this->successResponse($response, $msg, $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function listarAlunos(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $data = TurmaService::listarAlunos($id);
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function listarAlunosDisponiveis(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $data = TurmaService::listarAlunosDisponiveis($id);
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function adicionarAluno(Request $request, Response $response, array $args): Response
    {
        try {
            $turma_id = (int) ($args['id'] ?? 0);
            $body = $this->getRequestBody($request);

            $validationError = $this->validateRequired($body, ['aluno_id']);
            if ($validationError) {
                return $this->errorResponse($response, $validationError);
            }

            TurmaService::adicionarAluno($turma_id, (int) $body['aluno_id']);
            return $this->successResponse($response, 'Aluno adicionado à turma.');
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function removerAluno(Request $request, Response $response, array $args): Response
    {
        try {
            $turma_id = (int) ($args['id'] ?? 0);
            $aluno_id = (int) ($args['aluno_id'] ?? 0);
            TurmaService::removerAluno($turma_id, $aluno_id);
            return $this->successResponse($response, 'Aluno removido da turma.');
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
