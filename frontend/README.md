# Arenas Gestão - Frontend React

## Sobre o Projeto

Aplicação web desenvolvida em React com TypeScript utilizando Vite, com foco em gestão operacional da Arena Fitway. Consome a API RESTful do backend via camada de serviços centralizada.

## Arquitetura

O projeto utiliza uma **arquitetura em camadas** com separação de responsabilidades:

- **Pages**: Camada de apresentação, responsável pela interface e interação do usuário
- **Service**: Camada de acesso à API, responsável por todas as requisições HTTP ao backend
- **Utils**: Funções utilitárias reutilizáveis (alertas, formatações, etc.)
- **Theme**: Customização global do design system (Chakra UI)
- **Layouts**: Componentes estruturais de layout (autenticado e protegido)

## Padrões de Projeto Utilizados

- **Service Layer**: Centralização de todas as requisições HTTP na pasta `service/`
- **Protected Routes**: Validação do token JWT antes de renderizar rotas privadas
- **Layout Pattern**: Layouts reutilizáveis separados por contexto (`AuthLayout`, `ProtectedLayout`)
- **Component Composition**: Composição de componentes via `<Outlet />` do React Router

## Estrutura de Pastas

```
src/
├── pages/                  # Páginas da aplicação (uma pasta por módulo)
│   ├── home/               # Página principal / dashboard
│   └── login/              # Página de autenticação
├── service/                # Requisições HTTP para a API
│   ├── http.ts             # Instância do Axios, token e validação JWT
│   ├── auth.ts             # Funções de autenticação (login, logout)
│   └── dashboard.ts        # Funções de requisição do módulo dashboard
├── theme/
│   └── index.ts            # Tema global do Chakra UI (cores, fontes, etc.)
├── utils/
│   └── alertas.ts          # Funções utilitárias de alertas e notificações
├── AuthLayout.tsx          # Layout para páginas públicas (login)
├── ProtectedLayout.tsx     # Layout para páginas protegidas (valida JWT)
├── App.tsx                 # Definição de rotas da aplicação
└── main.tsx                # Entry point da aplicação
```

## Camada de Service

A pasta `service/` é a única responsável por se comunicar com a API. Nenhuma página deve fazer requisições diretamente.

| Arquivo        | Responsabilidade                                          |
|----------------|-----------------------------------------------------------|
| `http.ts`      | Configuração do Axios, helpers de token (get/set/remove/validate) |
| `auth.ts`      | Funções de login e logout                                 |
| `dashboard.ts` | Funções de requisição do módulo dashboard                 |

> Ao criar um novo módulo, crie o arquivo de service correspondente na pasta `service/` (ex.: `procedimento.ts`).

## Tecnologias

- **React 18** com **TypeScript**
- **Vite**: Build tool e servidor de desenvolvimento
- **Chakra UI**: Design system e componentes visuais
- **React Router DOM**: Gerenciamento de rotas
- **Axios**: Cliente HTTP para requisições à API
- **Docker & Docker Compose**: Containerização

## Fluxo de Autenticação

1. Usuário preenche e-mail e senha na página `/login`
2. `auth.ts` envia `POST /login` para a API
3. A API retorna o token JWT, que é armazenado via `http.ts`
4. Ao navegar para rotas protegidas, `ProtectedLayout` valida o token
5. Se o token for inválido ou expirado, o usuário é redirecionado para `/login`

## Rotas da Aplicação

### Rotas Públicas

| Rota     | Componente  | Descrição               |
|----------|-------------|-------------------------|
| `/`      | `Login`     | Redireciona para login  |
| `/login` | `Login`     | Página de autenticação  |

### Rotas Protegidas (requerem JWT válido)

| Rota         | Componente    | Descrição               |
|--------------|---------------|-------------------------|
| `/dashboard` | `Dashboard`   | Painel principal        |

## Como Executar

### Pré-requisitos

- Docker
- Docker Compose

### Configuração

1. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

2. Ajuste a URL da API no `.env`:
```env
VITE_API_BASE_URL=http://localhost:8085
```

3. Execute com Docker:
```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:5173`

### Desenvolvimento local (sem Docker)

```bash
npm install
npm run dev
```

## Variáveis de Ambiente

| Variável           | Descrição                    | Exemplo                    |
|--------------------|------------------------------|----------------------------|
| `VITE_API_BASE_URL`| URL base da API backend      | `http://localhost:8085`    |
