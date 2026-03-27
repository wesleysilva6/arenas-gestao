# Controle Gastos - API PHP com Slim Framework

## Sobre o Projeto

API RESTful desenvolvida em PHP utilizando o framework Slim 4, com arquitetura limpa e padrões de desenvolvimento modernos.

## Arquitetura

O projeto utiliza uma **arquitetura em camadas** com separação de responsabilidades:

- **Controllers**: Camada de apresentação, responsável pelo recebimento e resposta de requisições HTTP
- **Services**: Camada de aplicação, contém a lógica de negócio
- **Repositories**: Camada de dados, responsável pelo acesso ao banco de dados
- **Infrastructures**: Configurações e recursos de infraestrutura

## Padrões de Projeto Utilizados

- **Service Layer**: Centralização da lógica de negócio
- **Repository Pattern**: Encapsulamento da lógica de acesso a dados
- **Singleton**: Para conexão com banco de dados
- **Factory Pattern**: Criação da aplicação Slim
- **PSR-4**: Autoload de classes seguindo padrões PSR

## Estrutura de Pastas

```
src/
├── Controllers/           # Controladores da aplicação
├── Domains/
│   ├── Repositories/      # Contratos e implementações de repositórios
│   ├── Services/          # Serviços com lógica de negócio
│   └── SQL/              # Queries SQL
├── Infrastructures/
│   └── Config/           # Configurações da aplicação
├── Adapters/
│   ├── Controllers/      # Adaptadores de controladores
│   └── Middlewares/      # Middlewares personalizados
└── routes.php            # Definição das rotas
```

## Tecnologias

- **PHP 8+**
- **Slim Framework 4**: Micro framework para APIs
- **PostgreSQL**: Banco de dados relacional
- **Docker & Docker Compose**: Containerização
- **PSR-7**: HTTP message interfaces
- **DotEnv**: Gerenciamento de variáveis de ambiente

## Como Executar

### Pré-requisitos

- Docker
- Docker Compose

### Configuração

1. Clone o repositório:
```bash
git clone <repository-url>
cd backend
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute com Docker:
```bash
docker-compose up -d
```

4. Entre no container e instale as dependências:
```bash
docker exec -it php bash
composer install -o
```

A API estará disponível em `http://localhost:8085`

### Endpoints Disponíveis

- `GET /check` - Health check da aplicação

### Desenvolvimento

Para desenvolvimento local, o container PHP está configurado com volume compartilhado, permitindo alterações em tempo real.
 