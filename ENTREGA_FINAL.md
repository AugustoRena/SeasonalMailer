# SeasonalMailer — Resumo do projeto

## O que foi construído

Aplicação web completa para envio de emails em massa com rastreamento de aberturas.

### Funcionalidades

| Funcionalidade | Status |
|---|---|
| Envio em massa com PDF anexado | ✅ |
| Delay de 10s entre emails (anti-bloqueio) | ✅ |
| Envio em lotes (sem timeout no Netlify) | ✅ |
| Progresso em tempo real | ✅ |
| Relatório detalhado por email | ✅ |
| Rastreamento de aberturas por pixel | ✅ |
| Painel de rastreamento por campanha | ✅ |
| Credenciais via variáveis de ambiente | ✅ |
| Sessão persistente (refresh não desloga) | ✅ |
| Validação de tamanho de PDF (4 MB) | ✅ |
| Validação de formato de email | ✅ |
| CORS configurado nas funções | ✅ |
| Deduplicação de aberturas no Supabase | ✅ |

### Arquivos de código

```
src/
├── App.js                         navegação entre abas
├── App.css                        estilos
├── index.js
├── pages/
│   ├── SetupPage.js               verificação de conexão SMTP
│   ├── SendPage.js                formulário + lógica de envio em lotes
│   ├── ProgressPage.js            progresso real por lotes
│   ├── ResultsPage.js             relatório final
│   └── TrackingPage.js            painel de aberturas
└── netlify/
    └── functions/
        ├── package.json           dependências do backend
        ├── test-connection.js     verifica Gmail SMTP
        ├── send-emails.js         envia lote + injeta pixel
        ├── track-open.js          serve pixel + registra no Supabase
        └── get-events.js          retorna eventos para o painel
```

### Tecnologias

- **Frontend**: React 18, CSS3
- **Backend**: Node.js, Netlify Functions
- **Email**: Gmail SMTP via nodemailer
- **Rastreamento**: Supabase (PostgreSQL)
- **Hosting**: Netlify (plano gratuito)

---

## Para colocar em produção

1. Executar `SUPABASE_SETUP.sql` no Supabase SQL Editor
2. Fazer push para o GitHub
3. Criar site no Netlify conectado ao repositório
4. Configurar 4 variáveis de ambiente:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
5. Disparar novo deploy

Veja `QUICK_START.txt` para o passo a passo completo.

---

## Limites conhecidos

- Gmail SMTP: ~500 emails/hora
- PDF: máximo 4 MB por envio
- Rastreamento por pixel: precisão de ~60–70% (Apple Mail pré-carrega imagens)
- Netlify Functions: 125.000 invocações/mês no plano gratuito
- Supabase: 500 MB de banco de dados no plano gratuito
