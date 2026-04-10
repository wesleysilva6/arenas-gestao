<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\ProcedimentoController;
use App\Controllers\LoginController;
use App\Controllers\DashboardController;
use App\Controllers\AlunoController;
use App\Controllers\ModalidadeController;
use App\Infrastructures\Middleware\JwtAuthMiddleware;

// Rotas Públicas (sem autenticação)
$app->post('/login', LoginController::class . ':login');

// Rotas Protegidas (com autenticação JWT)
$app->group('', function ($group) {
    // Dashboard
    $group->get('/dashboard', DashboardController::class . ':index');

    // Alunos
    $group->get('/alunos', AlunoController::class . ':listar');
    $group->get('/alunos/modalidades', AlunoController::class . ':modalidades');
    $group->get('/alunos/{id}', AlunoController::class . ':buscar');
    $group->post('/alunos', AlunoController::class . ':cadastrar');
    $group->put('/alunos/{id}', AlunoController::class . ':editar');
    $group->delete('/alunos/{id}', AlunoController::class . ':deletar');
    $group->patch('/alunos/{id}/cancelar', AlunoController::class . ':cancelar');

    // Modalidades
    $group->get('/modalidades', ModalidadeController::class . ':listar');
    $group->post('/modalidades', ModalidadeController::class . ':cadastrar');
    $group->put('/modalidades/{id}', ModalidadeController::class . ':editar');
    $group->patch('/modalidades/{id}/status', ModalidadeController::class . ':toggleStatus');

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