<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\ProcedimentoController;
use App\Controllers\LoginController;
use App\Infrastructures\Middleware\JwtAuthMiddleware;

// Rotas Públicas (sem autenticação)
$app->post('/login', LoginController::class . ':login');

// Rotas Protegidas (com autenticação JWT)
$app->group('', function ($group) {
    // Rotas Procedimento
    $group->get('/procedimento', ProcedimentoController::class . ':Listar');
    $group->post('/procedimento', ProcedimentoController::class . ':Cadastrar');
    $group->put('/procedimento', ProcedimentoController::class . ':Editar');
    $group->delete('/procedimento', ProcedimentoController::class . ':Deletar');
})->add(new JwtAuthMiddleware());

// Catch-all OPTIONS para qualquer rota (melhor compatibilidade com proxies)
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response->withHeader('Content-Type', 'application/json');
});