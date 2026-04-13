# Arenas Gestão — Frontend

Aplicação web SPA desenvolvida em React 19 com TypeScript, Vite e Chakra UI para gestão de arenas esportivas. Consome a API RESTful do backend e integra com o serviço WhatsApp.

## Arquitetura

```
src/
├── pages/                  # Páginas organizadas por módulo
│   ├── dashboard/          # Painel com métricas e vencimentos
│   ├── alunos/             # CRUD de alunos (7 componentes)
│   ├── modalidades/        # CRUD de modalidades
│   ├── turmas/             # CRUD de turmas + matrícula
│   ├── mensalidades/       # Gestão de mensalidades
│   ├── gastos/             # Controle de despesas
│   ├── presencas/          # Controle de presenças
│   ├── mensagens/          # Envio de mensagens WhatsApp
│   ├── notificacoes/       # Centro de notificações
│   ├── configuracoes/      # Perfil e segurança
│   └── login/              # Autenticação
├── components/             # Componentes globais
│   ├── Sidebar.tsx         # Menu lateral com navegação
│   ├── Topbar.tsx          # Barra superior com notificações
│   └── AppLayout.tsx       # Layout principal (Sidebar + Topbar + Outlet)
├── contexts/               # Contextos React
│   ├── AuthContext.tsx     # Autenticação JWT (login, logout, user)
│   └── NotificacoesContext.tsx  # Notificações em tempo real
├── service/                # Camada HTTP — única responsável por acessar a API
│   ├── http.ts             # Instância Axios, token JWT, interceptors
│   ├── auth.ts             # Login
│   ├── dashboard.ts        # Dados do dashboard
│   ├── alunos.ts           # CRUD alunos + modalidades
│   ├── modalidades.ts      # CRUD modalidades
│   ├── turmas.ts           # CRUD turmas + matrícula
│   ├── mensalidades.ts     # Mensalidades + geração
│   ├── gastos.ts           # CRUD gastos + resumo
│   ├── presencas.ts        # Presenças por turma/aluno
│   ├── mensagens.ts        # Mensagens + grupos WhatsApp
│   ├── usuario.ts          # Perfil + alteração de senha
│   └── whatsapp.ts         # Cliente SSE do WhatsApp Service
├── utils/
│   ├── formatters.ts       # Formatação de CPF, telefone, moeda, data
│   ├── alertas.ts          # Alertas e confirmações (SweetAlert2)
│   └── types.ts            # Tipos compartilhados
├── theme/
│   └── index.ts            # Tema Chakra UI (cor brand: #1890FF)
├── AuthLayout.tsx          # Layout para rotas públicas
├── ProtectedLayout.tsx     # Layout protegido (valida JWT)
├── App.tsx                 # Definição de rotas
└── main.tsx                # Entry point
```

### Padrões utilizados

- **Service Layer** — toda comunicação HTTP centralizada em `service/`
- **Protected Routes** — `ProtectedLayout` valida JWT antes de renderizar
- **Component Composition** — cada página composta por componentes na pasta `components/`
- **Context API** — estado global de autenticação e notificações
- **Formatters centralizados** — `utils/formatters.ts` com máscaras de CPF, telefone e moeda

## Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| React 19 | Framework UI |
| TypeScript 5.9 | Tipagem estática |
| Vite 7 | Build tool e dev server |
| Chakra UI 2 | Design system e componentes |
| React Router 7 | Roteamento SPA |
| Axios | Cliente HTTP |
| Framer Motion | Animações |
| ExcelJS | Exportação para Excel |
| jsPDF | Geração de PDFs |
| date-fns | Manipulação de datas |
| SweetAlert2 | Alertas e confirmações |

## Rotas da Aplicação

### Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Login | Redirecionamento para login |
| `/login` | Login | Autenticação com email e senha |

### Protegidas (requerem JWT válido)

| Rota | Página | Descrição |
|------|--------|-----------|
| `/dashboard` | Dashboard | Métricas, receita, vencimentos |
| `/alunos` | Alunos | Cadastro e gestão de alunos |
| `/modalidades` | Modalidades | Gerenciamento de modalidades |
| `/turmas` | Turmas | Turmas, horários e matrículas |
| `/mensalidades` | Mensalidades | Cobrança e confirmação de pagamento |
| `/gastos` | Gastos | Registro de despesas por categoria |
| `/presencas` | Presenças | Controle de frequência |
| `/mensagens` | Mensagens | Envio WhatsApp individual/em massa |
| `/notificacoes` | Notificações | Alertas de vencimentos e pendências |
| `/configuracoes` | Configurações | Perfil, email e senha |

## Camada de Service

Nenhuma página faz requisições HTTP diretamente. Toda comunicação passa pela pasta `service/`:

| Arquivo | Responsabilidade |
|---------|-----------------|
| `http.ts` | Instância Axios, JWT helpers (save/get/clear/validate), interceptors |
| `auth.ts` | `POST /login` |
| `dashboard.ts` | `GET /dashboard` |
| `alunos.ts` | CRUD alunos, listagem de modalidades, turmas por aluno |
| `modalidades.ts` | CRUD modalidades, toggle status |
| `turmas.ts` | CRUD turmas, matrícula/remoção de alunos |
| `mensalidades.ts` | Listagem, confirmação, geração mensal |
| `gastos.ts` | CRUD gastos, resumo mensal por categoria |
| `presencas.ts` | Listagem por turma/aluno, marcação de presença |
| `mensagens.ts` | Histórico, envio, grupos WhatsApp, templates |
| `usuario.ts` | Perfil, atualização de dados, alteração de senha |
| `whatsapp.ts` | SSE (status/QR), connect, disconnect, send, send-bulk |

## Formatadores (`utils/formatters.ts`)

| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `formatCurrency(value)` | Exibição de moeda | `R$ 1.234,56` |
| `maskCurrency(value)` | Máscara de input monetário | `1.234,56` |
| `unmaskCurrency(value)` | Converte máscara para `number` | `1234.56` |
| `formatCPF(cpf)` | Exibição de CPF | `123.456.789-00` |
| `maskCPF(value)` | Máscara de input CPF | `123.456.789-00` |
| `unmaskCPF(value)` | Remove máscara | `12345678900` |
| `formatPhone(phone)` | Exibição de telefone | `(11) 99999-0000` |
| `maskPhone(value)` | Máscara de input telefone | `(11) 99999-0000` |
| `unmaskPhone(value)` | Remove máscara | `11999990000` |
| `formatDate(dateStr)` | Exibição de data | `12/04/2026` |

## Fluxo de Autenticação

1. Usuário envia email + senha em `/login`
2. `auth.ts` faz `POST /login` → backend retorna JWT
3. Token salvo no localStorage via `http.ts`
4. `ProtectedLayout` valida o token a cada navegação
5. Token expirado → redirecionamento automático para `/login`
6. Axios interceptor injeta `Authorization: Bearer <token>` em todas as requisições

## Como Executar

### Desenvolvimento local

```bash
cd frontend
npm install       # ou yarn install
npm run dev       # http://localhost:5173
```

### Produção com Docker

```bash
cd frontend
docker compose up -d    # http://localhost:3000
```

### Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação ESLint |
| `npm run lint:fix` | Correção automática ESLint |
| `npm run format` | Formatação Prettier |

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL da API backend | `http://localhost:8085` |
| `VITE_WA_BASE_URL` | URL do WhatsApp Service | `http://localhost:3001` |
