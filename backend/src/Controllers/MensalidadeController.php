<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\MensalidadeService;
use Exception;

class MensalidadeController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        try {
            $data = MensalidadeService::listar();
            return $this->jsonResponse($response, ['success' => true, 'data' => $data]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function confirmarPagamento(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int) ($args['id'] ?? 0);
            $data = MensalidadeService::confirmarPagamento($id);
            return $this->successResponse($response, 'Pagamento confirmado com sucesso!', $data);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function gerarMesAtual(Request $request, Response $response): Response
    {
        try {
            $body = $this->getRequestBody($request);
            $mesReferencia = $body['mes_referencia'] ?? null;

            if (!$mesReferencia || !preg_match('/^\d{4}-\d{2}$/', $mesReferencia)) {
                return $this->errorResponse($response, 'mes_referencia inválido. Use o formato YYYY-MM.');
            }

            [$ano, $mes] = array_map('intval', explode('-', $mesReferencia));
            $result = MensalidadeService::gerarMesAtual($mesReferencia, $ano, $mes);

            return $this->jsonResponse($response, [
                'success' => true,
                'geradas' => $result['geradas'],
                'message' => $result['geradas'] > 0
                    ? "{$result['geradas']} mensalidade(s) gerada(s) com sucesso!"
                    : 'Todos os alunos já possuem mensalidade neste mês.',
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }

    public function contarSemMensalidade(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $mesReferencia = $params['mes_referencia'] ?? null;

            if (!$mesReferencia || !preg_match('/^\d{4}-\d{2}$/', $mesReferencia)) {
                return $this->errorResponse($response, 'mes_referencia inválido. Use o formato YYYY-MM.');
            }

            $total = MensalidadeService::contarSemMensalidade($mesReferencia);
            return $this->jsonResponse($response, ['success' => true, 'total' => $total]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
