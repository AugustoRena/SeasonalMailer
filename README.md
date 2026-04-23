# SeasonalMailer 📧

Aplicação React para envio de emails em massa com anexo de PDF e rastreamento de aberturas, hospedada no Netlify com backend serverless.

## Funcionalidades

- Envio em massa de emails com PDF anexado via Gmail SMTP
- Delay de 30 segundos entre cada email (evita bloqueio do Gmail)
- Progresso em tempo real durante o envio
- Relatório detalhado ao finalizar (enviados, erros, horários)
- Rastreamento de aberturas por pixel invisível
- Painel de rastreamento agrupado por campanha
- Credenciais seguras via variáveis de ambiente (nunca expostas ao cliente)
- Sessão persistente via sessionStorage (refresh não desloga)

## Estrutura do projeto

```
SeasonalMailer/
├── public/
│   └── index.html
├── src/
│   ├── App.js                        # Navegação entre abas (Enviar / Rastreamento)
│   ├── App.css
│   ├── index.js
│   ├── pages/
│   │   ├── SetupPage.js              # Verificação de conexão SMTP
│   │   ├── SendPage.js               # Formulário de envio
│   │   ├── ProgressPage.js           # Progresso real por lotes
│   │   ├── ResultsPage.js            # Relatório final
│   │   └── TrackingPage.js           # Painel de aberturas
│   └── netlify/
│       └── functions/
│           ├── package.json          # Dependências exclusivas das functions
│           ├── test-connection.js    # Verifica SMTP do Gmail
│           ├── send-emails.js        # Envia lote de emails com pixel
│           ├── track-open.js         # Serve pixel e registra abertura no Supabase
│           └── get-events.js         # Retorna eventos para o painel
├── package.json
├── netlify.toml
└── SUPABASE_SETUP.sql                # SQL para criar a tabela no Supabase
```

## Pré-requisitos

- Conta no GitHub
- Conta no Netlify (plano gratuito é suficiente)
- Gmail com senha de app gerada
- Conta no Supabase (gratuita, apenas para rastreamento)

## Configuração

### 1. Senha de app do Gmail

A aplicação usa Gmail SMTP via senha de app — nunca sua senha principal.

1. Acesse https://myaccount.google.com/apppasswords
2. Crie uma senha para "Mail"
3. Copie os 16 caracteres gerados

> Autenticação em dois fatores precisa estar ativa na conta para acessar essa página.

### 2. Supabase (rastreamento de aberturas)

1. Crie um projeto em https://supabase.com
2. No painel, vá em **SQL Editor** e execute o conteúdo de `SUPABASE_SETUP.sql`
3. Copie os valores em **Project Settings → API**:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (não a anon key) → `SUPABASE_SERVICE_KEY`

### 3. Variáveis de ambiente no Netlify

Em **Site settings → Environment variables**, adicione:

| Variável | Valor |
|---|---|
| `GMAIL_USER` | seu-email@gmail.com |
| `GMAIL_APP_PASSWORD` | senha de 16 caracteres |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | service_role key do Supabase |

> O rastreamento funciona sem as variáveis do Supabase — o pixel simplesmente não registra eventos.

## Deploy

### Via GitHub (recomendado)

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/seasonal-mailer.git
git push -u origin main
```

No Netlify: **Add new site → Import an existing project → GitHub**, selecione o repositório. As configurações de build já estão no `netlify.toml`.

### Configurações de build (netlify.toml)

```toml
[build]
  command = "npm run build"
  functions = "src/netlify/functions"
  publish = "build"
```

## Como usar

### Aba Enviar

1. Na primeira visita, clique em **Testar Conexão** — verifica se as credenciais do Gmail estão corretas no Netlify
2. Faça upload do PDF (limite: 4 MB)
3. Cole os emails separados por `;`
4. Preencha assunto e corpo
5. Clique em **Enviar** — o progresso atualiza a cada lote de 2 emails

### Aba Rastreamento

Exibe todas as aberturas registradas, agrupadas por campanha, com email, horário e cliente de email identificado. Atualiza automaticamente a cada 30 segundos.

## Limitações do Gmail SMTP

- ~500 emails por hora
- Recomendado: até 300 emails por campanha por dia
- 10 segundos de delay entre emails é necessário para evitar bloqueio

## Rastreamento de aberturas

O pixel de rastreamento é uma imagem 1×1 invisível inserida em cada email. Quando o cliente de email carrega a imagem, a abertura é registrada.

**Limitações conhecidas:**
- Apple Mail (desde 2021) pré-carrega imagens automaticamente — pode registrar abertura sem o usuário ter lido
- Gmail via web pode bloquear imagens externas na primeira vez
- Clientes corporativos frequentemente bloqueiam imagens por padrão

A precisão real gira em torno de 60–70%.

## Troubleshooting

**"Erro ao conectar com o servidor" ao testar conexão**
Verifique se `GMAIL_USER` e `GMAIL_APP_PASSWORD` estão configurados corretamente nas variáveis de ambiente do Netlify e faça um novo deploy.

**"Invalid login" nos logs do Netlify**
Confirme que está usando a senha de app (16 caracteres), não a senha normal do Gmail.

**Emails param no 4º ou 5º envio**
Verifique os logs da função no painel do Netlify (Functions → send-emails → logs recentes). O mais comum é a conexão SMTP ser encerrada pelo Gmail por inatividade — reabrir a aplicação e reenviar os restantes resolve.

**Painel de rastreamento vazio mesmo após aberturas**
Confirme que `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretos e que o SQL de setup foi executado no Supabase.
