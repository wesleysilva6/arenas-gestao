<?php

namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Controllers\ControllerBase;
use App\Domains\Services\DashboardService;
use Exception;

class DashboardController extends ControllerBase
{
    public function index(Request $request, Response $response): Response
    {
        try {
            $data = DashboardService::obterDados();

            return $this->jsonResponse($response, [
                'success' => true,
                'data' => $data
            ]);
        } catch (Exception $e) {
            return $this->errorResponse($response, $e->getMessage(), 500);
        }
    }
}
