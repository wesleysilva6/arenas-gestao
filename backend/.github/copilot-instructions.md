# 🚀 Instruções para GitHub Copilot - Projeto Arena Beach Tennis API

## 📋 Visão Geral do Projeto

Esta é uma **API REST em PHP usando Slim Framework 4** para gerenciamento de dentistas em uma aplicação corporativa. O projeto segue uma **arquitetura limpa** com separação clara de responsabilidades.

### 🏗️ Estrutura do Projeto
```
src/
├── Controllers/           # Controladores (recebem Request, retornam Response)
│   ├── ControllerBase.php # Classe base com métodos auxiliares
│   └── DentistaController.php
├── Domains/
│   ├── Services/         # Lógica de negócio
│   ├── Repositories/     # Acesso a dados
│   └── SQL/             # Queries SQL
├── Infrastructures/
│   └── Config/          # Configurações (Database, Config)
└── routes.php           # Definição das rotas
```

## 🎯 Padrões de Código Estabelecidos

### 📌 **1. Controllers**
- ✅ Herdam de `ControllerBase`
- ✅ Métodos recebem `Request $request, Response $response` (e `array $args` se houver parâmetros de rota)
- ✅ SEMPRE retornam `Response` usando métodos auxiliares
- ✅ Não contêm lógica de negócio, apenas validação básica e orquestração

**Exemplo de método correto:**
```php
public function verificarCpf(Request $request, Response $response, array $args): Response
{
    $cpf = $request->getAttribute('cpf') ?? null;
    
    if (!$cpf) {
        return $this->errorResponse($response, 'cpf necessário');
    }

    $result = DentistaService::VerificarCpfRetornarNome($cpf);
    return $this->jsonResponse($response, $result);
}
```

### 📌 **2. Métodos Auxiliares do ControllerBase**
Sempre use estes métodos para respostas padronizadas:

- `$this->jsonResponse($response, $data, $status = 200)`
- `$this->successResponse($response, $message, $data = [], $status = 200)`
- `$this->errorResponse($response, $message, $status = 400, $data = [])`
- `$this->getRequestBody($request)` - para pegar o body da request
- `$this->validateRequired($data, $requiredFields)` - para validar campos obrigatórios

### 📌 **3. Routes (routes.php)**
- ✅ Use sintaxe: `$app->get('/rota', ControllerClass::class . ':metodo')`
- ✅ NÃO use closures inline nas rotas
- ✅ Parâmetros de rota: `/dentista/{cpf}`

**Exemplo correto:**
```php
$app->get('/dentista/{cpf}', DentistaController::class . ':verificarCpf');
$app->post('/dentista', DentistaController::class . ':Cadastrar');
```

### 📌 **4. Services**
- ✅ Contêm toda a lógica de negócio
- ✅ São chamados diretamente pelos Controllers: `DentistaService::metodho()`
- ✅ Métodos estáticos para simplicidade
- ✅ Retornam arrays com dados estruturados

### 📌 **5. Validação e Tratamento de Erros**
- ✅ Use `validateRequired()` para campos obrigatórios
- ✅ Sempre retorne mensagens de erro em português
- ✅ Status codes apropriados: 200 (sucesso), 400 (bad request), 404 (not found), 409 (conflict), 500 (server error)

### 📌 **6. Nomenclatura**
- ✅ **Português** para nomes de métodos e variáveis de negócio
- ✅ **CamelCase** para métodos: `Cadastrar`, `EditarDentista`, `AlterarSituacao`
- ✅ **snake_case** para variáveis de banco: `$cpf`, `$nome`, `$uf_cro`
- ✅ **Inglês** apenas para termos técnicos: `Request`, `Response`, `Controller`

## 🚫 O QUE NÃO FAZER

### ❌ **NÃO faça closures nas rotas:**
```php
// ERRADO
$app->get('/rota', function($request, $response) { ... });
```

### ❌ **NÃO retorne arrays nos controllers:**
```php
// ERRADO
return ['status' => 200, 'body' => $data];
```

### ❌ **NÃO faça JSON manual:**
```php
// ERRADO
$response->getBody()->write(json_encode($data));
return $response->withHeader('Content-Type', 'application/json');
```

### ❌ **NÃO injete dependências por parâmetro:**
```php
// ERRADO - complexo desnecessário
public function __construct(DentistaService $service) { ... }
```

## 🎨 Exemplos de Código Perfeito

### **Controller Completo:**
```php
class DentistaController extends ControllerBase
{
    public function Cadastrar(Request $request, Response $response): Response
    {
        $body = $this->getRequestBody($request);
        $requiredFields = ['cpf', 'nome', 'cro', 'uf_cro', 'especialidades'];
        
        $validationError = $this->validateRequired($body, $requiredFields);
        if ($validationError) {
            return $this->errorResponse($response, $validationError);
        }

        $data = DentistaService::Cadastrar(
            $body['cpf'], $body['nome'], $body['cro'], 
            $body['uf_cro'], $body['especialidades']
        );
        
        if (empty($data)) {
            return $this->errorResponse($response, 'CPF não encontrado', 404);
        }

        return $this->successResponse($response, 'Dados salvos com sucesso!', $data);
    }
}
```

### **Rota Perfeita:**
```php
$app->post('/dentista', DentistaController::class . ':Cadastrar');
$app->get('/dentista/{cpf}', DentistaController::class . ':verificarCpf');
$app->put('/dentista', DentistaController::class . ':EditarDentista');
```

## 🧠 Contexto para IA

### **Quando sugerir código:**
1. **SEMPRE** use os padrões estabelecidos acima
2. **Priorize** simplicidade sobre complexidade
3. **Mantenha** a separação de responsabilidades
4. **Use** português para domínio de negócio, inglês para técnico
5. **Aplique** os métodos auxiliares do ControllerBase
6. **Evite** over-engineering ou padrões desnecessários

### **Frameworks e Tecnologias:**
- **Slim Framework 4** (PSR-7, PSR-15)
- **PHP 8+** com tipagem forte
- **JSON** como formato de resposta padrão
- **Composer** para autoload PSR-4
- **Arquitetura MVC** simplificada

### **Estrutura de Resposta Padrão:**
```json
{
  "message": "Operação realizada com sucesso",
  "data": { ... }
}

// Para erros:
{
  "error": "Mensagem do erro"
}
```

## 🎯 Objetivos do Projeto
- **Performance** e **simplicidade** sobre complexidade
- **Código limpo** e **fácil manutenção**
- **Padronização** consistente em todo o projeto
- **Reutilização** através do ControllerBase
- **Legibilidade** em português para domínio de negócio

---

💡 **Lembre-se:** Este projeto prioriza **simplicidade elegante** sobre **complexidade desnecessária**. Quando em dúvida, escolha a solução mais simples que funcione.