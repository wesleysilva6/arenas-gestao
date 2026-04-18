# NovaWave - Arena — Backend API

API RESTful desenvolvida em PHP 8.2 com Slim Framework 4, PostgreSQL 15 e Docker.

## Arquitetura

O projeto segue uma **arquitetura em camadas** com separação clara de responsabilidades:

```
src/
├── Controllers/           # Recebimento de requisições HTTP e respostas
├── Domains/
│   ├── Repositories/      # Acesso ao banco de dados (static methods)
│   ├── Services/          # Lógica de negócio e validações
│   └── SQL/               # Queries SQL organizadas por módulo
│       ├── aluno/
│       ├── dashboard/
│       ├── gasto/
│       ├── login/
│       ├── mensagem/
│       ├── mensalidade/
│       ├── modalidade/
│       ├── presenca/
│       ├── turma/
│       └── usuario/
├── Infrastructures/
│   ├── Config/            # Database, conexão PDO
│   └── Middleware/         # JwtAuthMiddleware
└── routes.php             # Definição de todas as rotas
```

### Padrões utilizados

- **Service Layer** — lógica de negócio centralizada nos Services
- **Repository Pattern** — queries SQL em arquivos `.sql` separados, executados via `Database::switchParams()`
- **JWT Auth** — autenticação via `firebase/php-jwt` com middleware
- **PSR-4 Autoload** — carregamento automático de classes via Composer

## Tecnologias

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| PHP | 8.2 | Linguagem principal |
| Slim Framework | 4 | Micro framework HTTP |
| PostgreSQL | 15 | Banco de dados |
| Firebase PHP-JWT | — | Autenticação JWT |
| Docker | — | Containerização |
| Composer | — | Gerenciamento de dependências |

## Endpoints da API

### Públicos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Autenticação (retorna JWT) |

### Protegidos (requerem `Authorization: Bearer <token>`)

#### Dashboard

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard` | Dados resumidos do painel |

#### Alunos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alunos` | Listar alunos |
| GET | `/alunos/{id}` | Buscar aluno por ID |
| POST | `/alunos` | Cadastrar aluno |
| PUT | `/alunos/{id}` | Editar aluno |
| DELETE | `/alunos/{id}` | Excluir aluno |
| PATCH | `/alunos/{id}/cancelar` | Cancelar aluno |
| GET | `/alunos/{id}/turmas` | Turmas do aluno |
| GET | `/alunos/modalidades` | Modalidades para formulário |

#### Modalidades

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/modalidades` | Listar modalidades |
| POST | `/modalidades` | Cadastrar modalidade |
| PUT | `/modalidades/{id}` | Editar modalidade |
| PATCH | `/modalidades/{id}/status` | Ativar/desativar |

#### Turmas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/turmas` | Listar turmas |
| POST | `/turmas` | Cadastrar turma |
| PUT | `/turmas/{id}` | Editar turma |
| PATCH | `/turmas/{id}/status` | Ativar/desativar |
| GET | `/turmas/{id}/alunos` | Alunos da turma |
| GET | `/turmas/{id}/alunos-disponiveis` | Alunos disponíveis |
| POST | `/turmas/{id}/alunos` | Matricular aluno |
| DELETE | `/turmas/{id}/alunos/{aluno_id}` | Remover aluno |

#### Mensalidades

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/mensalidades` | Listar mensalidades |
| PATCH | `/mensalidades/{id}/confirmar` | Confirmar pagamento |
| POST | `/mensalidades/gerar` | Gerar mensalidades do mês |
| GET | `/mensalidades/sem-mensalidade` | Alunos sem mensalidade |

#### Gastos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/gastos` | Listar gastos |
| POST | `/gastos` | Cadastrar gasto |
| PUT | `/gastos/{id}` | Editar gasto |
| DELETE | `/gastos/{id}` | Excluir gasto |
| GET | `/gastos/resumo` | Resumo mensal por categoria |

#### Presenças

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/presencas/turmas` | Turmas para controle |
| GET | `/presencas/aluno/{id}` | Presenças do aluno |
| PATCH | `/presencas/{id}/marcar` | Marcar presença |

#### Mensagens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/mensagens/historico` | Histórico de mensagens |
| DELETE | `/mensagens/historico` | Limpar histórico |
| GET | `/mensagens/alunos-turma-map` | Mapeamento aluno-turma |
| POST | `/mensagens` | Registrar mensagem |

#### Grupos WhatsApp

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/grupos-whatsapp` | Listar grupos |
| POST | `/grupos-whatsapp` | Cadastrar grupo |
| PUT | `/grupos-whatsapp/{id}` | Editar grupo |
| DELETE | `/grupos-whatsapp/{id}` | Excluir grupo |

#### Usuário

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/usuario/perfil` | Buscar perfil |
| PUT | `/usuario/dados` | Atualizar nome/email |
| POST | `/usuario/verificar-senha` | Verificar senha atual |
| PUT | `/usuario/senha` | Alterar senha |

## Como Executar

### Pré-requisitos

- Docker e Docker Compose

### Configuração

```bash
cd backend
cp .env.example .env     # Configure as variáveis
docker compose up -d     # Inicia PHP + PostgreSQL
```

Na primeira execução, importe o schema:

```bash
docker exec -i backend-postgres psql -U postgres -d arenas_gestao < banco.sql
```

A API estará disponível em `http://localhost:8085`.

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do PostgreSQL | `postgres` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `arenas_gestao` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `DB_DRIVER` | Driver PDO | `pgsql` |
| `APP_NAME` | Nome da aplicação | `ArenaFitway` |
| `APP_ENV` | Ambiente | `development` |
| `CORS_ALLOWED_ORIGINS` | Origens CORS | `*` |

### Desenvolvimento

O container monta o diretório `src/` como volume — alterações no código são refletidas imediatamente sem rebuild.

Para rebuild após mudanças no Dockerfile:

```bash
docker compose up -d --build
```

## Padrão de Resposta

Todas as respostas seguem o formato:

```json
{
  "success": true,
  "data": [ ... ]
}
```

Em caso de erro:

```json
{
  "error": "Mensagem de erro"
}
```
 