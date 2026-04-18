# WhatsApp Service — NovaWave - Arena

Microserviço Node.js responsável pelo envio de mensagens via WhatsApp, usando a biblioteca [Baileys](https://github.com/WhiskeySockets/Baileys).

## Requisitos

- Node.js 18+
- NPM ou Yarn

## Instalação

```bash
cd whatsapp-service
npm install
```

## Executando

```bash
npm start
```

O serviço sobe na porta **3001** por padrão.  
Para usar outra porta, defina a variável de ambiente `WA_PORT`:

```bash
WA_PORT=4000 npm start
```

## Como conectar o WhatsApp

1. Com o serviço rodando, acesse o frontend da aplicação
2. Vá até a área de configurações de WhatsApp
3. Um **QR Code** será exibido — escaneie com o WhatsApp do celular  
   _(WhatsApp > Aparelhos conectados > Conectar aparelho)_
4. Após o scan, o status muda para **conectado** e mensagens podem ser enviadas

A sessão é salva na pasta `auth_info/` — enquanto ela existir, não é necessário escanear o QR Code novamente.

Para deslogar e limpar a sessão, use o endpoint `POST /disconnect`.

## Endpoints

| Método | Rota          | Descrição                                      |
|--------|---------------|------------------------------------------------|
| GET    | `/status`     | Retorna o status atual da conexão              |
| GET    | `/events`     | SSE — stream em tempo real de status e QR Code |
| POST   | `/connect`    | Inicia a conexão (se desconectado)             |
| POST   | `/disconnect` | Desloga e apaga a sessão salva                 |
| POST   | `/send`       | Envia mensagem para um número                  |
| POST   | `/send-bulk`  | Envia mensagem em massa para vários números    |

### POST /send

```json
{
  "phone": "11999998888",
  "message": "Olá! Sua mensalidade está vencendo."
}
```

### POST /send-bulk

```json
{
  "contacts": ["11999998888", "11977776666"],
  "message": "Olá! Sua mensalidade está vencendo."
}
```

> O número pode ser informado com ou sem o código do país (55 é adicionado automaticamente).

## Estrutura

```
whatsapp-service/
├── index.js       # Servidor Express + lógica Baileys
├── package.json
├── README.md
└── auth_info/     # Sessão salva (gerado automaticamente, não commitar)
```
