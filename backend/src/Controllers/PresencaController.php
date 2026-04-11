<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domains\Services\PresencaService;

class PresencaController extends ControllerBase
{
    public function listar(Request $request, Response $response): Response
    {
        $result = PresencaService::listarTurmasComPresencas();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function listarPorAluno(Request $request, Response $response, array $args): Response
    {
        $id = (int)($args['id'] ?? 0);
        $result = PresencaService::listarPorAluno($id);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function marcar(Request $request, Response $response, array $args): Response
    {
        $id      = (int)($args['id'] ?? 0);
        $body    = $request->getParsedBody() ?? [];
        $situacao = isset($body['situacao']) ? (int)$body['situacao'] : 0;

        $result = PresencaService::marcar($id, $situacao);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }
}
