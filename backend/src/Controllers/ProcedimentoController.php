<?php

namespace App\Controllers;

use App\Domains\Services\ProcedimentoService;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;

class ProcedimentoController extends ControllerBase
{
    public function Listar(Request $request, Response $response): Response
    {
        $query = $request->getQueryParams();
        $filters = [
            'descricao' => $query['descricao'] ?? null,
            'situacao' => $query['situacao'] ?? null,
        ];

        $data = ProcedimentoService::Listar($filters);
        return $this->jsonResponse($response, $data);
    }
    
    public function Cadastrar(Request $request, Response $response): Response
    {
        self::dd(['Cadastrar' => 'Cadastrar', 'args' => $request], 'ProcedimentoController - Cadastrar');
        
        $body = $this->getRequestBody($request);
        $requiredFields = ['descricao', 'situacao'];
        
        $validationError = $this->validateRequired($body, $requiredFields);
        if ($validationError) {
            return $this->errorResponse($response, $validationError);
        }

        $descricao = $body['descricao'];
        $situacao = $body['situacao'];

        $data = ProcedimentoService::Cadastrar($descricao, $situacao);

        return $this->successResponse($response, 'Dados salvos com sucesso!', $data);
    }

    public function Editar(Request $request, Response $response): Response
    {
        $body = $this->getRequestBody($request);
        $requiredFields = ['descricao', 'situacao'];
        
        
        $validationError = $this->validateRequired($body, $requiredFields);
        if ($validationError) {
            return $this->errorResponse($response, $validationError);
        }

        $idprocedimento = $body['idprocedimento'];
        $descricao = $body['descricao'];
        $situacao = $body['situacao'];
        $data = ProcedimentoService::Editar($idprocedimento, $descricao, $situacao);

        return $this->successResponse($response, 'Dados atualizados com sucesso!', $data);
    }

    public function Deletar(Request $request, Response $response): Response
    {
        $body = $this->getRequestBody($request);
        $requiredFields = ['idprocedimento'];
        
        $validationError = $this->validateRequired($body, $requiredFields);
        if ($validationError) {
            return $this->errorResponse($response, $validationError);
        }

        $idprocedimento = $body['idprocedimento'];
        $data = ProcedimentoService::Deletar($idprocedimento);

        return $this->successResponse($response, 'Dados deletados com sucesso!', $data);
    }
}
