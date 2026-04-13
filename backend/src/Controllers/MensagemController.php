<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Domains\Services\MensagemService;

class MensagemController extends ControllerBase
{
    // ── Grupos WhatsApp ──

    public function listarGrupos(Request $request, Response $response): Response
    {
        $result = MensagemService::listarGrupos();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function cadastrarGrupo(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody() ?? [];
        $dados = [
            'nome' => $body['nome'] ?? '',
            'link' => $body['link'] ?? '',
            'tipo' => $body['tipo'] ?? 'geral',
            'referencia_id' => isset($body['referencia_id']) && $body['referencia_id'] !== '' && $body['referencia_id'] !== null
                ? (int)$body['referencia_id']
                : null,
        ];
        $result = MensagemService::cadastrarGrupo($dados);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    public function editarGrupo(Request $request, Response $response, array $args): Response
    {
        $body = $request->getParsedBody() ?? [];
        $dados = [
            'id'   => (int)($args['id'] ?? 0),
            'nome' => $body['nome'] ?? '',
            'link' => $body['link'] ?? '',
            'tipo' => $body['tipo'] ?? 'geral',
            'referencia_id' => isset($body['referencia_id']) && $body['referencia_id'] !== '' && $body['referencia_id'] !== null
                ? (int)$body['referencia_id']
                : null,
        ];
        $result = MensagemService::editarGrupo($dados);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function deletarGrupo(Request $request, Response $response, array $args): Response
    {
        $id = (int)($args['id'] ?? 0);
        MensagemService::deletarGrupo($id);
        $response->getBody()->write(json_encode(['ok' => true]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    // ── Mensagens ──

    public function listarHistorico(Request $request, Response $response): Response
    {
        $result = MensagemService::listarHistorico();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function limparHistorico(Request $request, Response $response): Response
    {
        MensagemService::limparHistorico();
        $response->getBody()->write(json_encode(['ok' => true]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    public function cadastrar(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody() ?? [];
        $dados = [
            'tipo'     => $body['tipo'] ?? '',
            'destino'  => $body['destino'] ?? '',
            'mensagem' => $body['mensagem'] ?? '',
        ];
        $result = MensagemService::cadastrar($dados);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
    }

    // ── Mapa aluno↔turma ──

    public function alunosTurmaMap(Request $request, Response $response): Response
    {
        $result = MensagemService::alunosTurmaMap();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }
}
