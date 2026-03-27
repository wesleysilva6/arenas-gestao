<?php

namespace App\Domains\Repositories;

use App\Infrastructures\Config\Database;

class LoginRepository
{
    /**
     * Busca usuário por email
     * @param string $email
     * @return object|null
     */
    public static function buscarPorEmail(string $email): ?object
    {
        $params = ['email' => $email];
        $res = Database::switchParams($params, 'login/logar', true, false, '', 1);
        
        if (isset($res['error']) && $res['error']) {
            return null;
        }
        
        return $res['retorno'] ?? null;
    }
}
