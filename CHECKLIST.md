# Checklist — SeasonalMailer

Use este checklist antes do primeiro envio.

---

## Preparação

- [ ] Conta no Gmail com autenticação em dois fatores ativa
- [ ] Senha de app gerada em https://myaccount.google.com/apppasswords
- [ ] Projeto criado no Supabase
- [ ] SQL de `SUPABASE_SETUP.sql` executado no Supabase SQL Editor
- [ ] Project URL e service_role key copiados do Supabase
- [ ] Repositório criado no GitHub com o código enviado
- [ ] Site criado no Netlify conectado ao repositório

---

## Variáveis de ambiente no Netlify

- [ ] `GMAIL_USER` configurado
- [ ] `GMAIL_APP_PASSWORD` configurado (16 caracteres, sem espaços)
- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_SERVICE_KEY` configurado (service_role, não anon)
- [ ] Deploy disparado após salvar as variáveis

---

## Teste antes do primeiro envio

- [ ] Acessou a URL do Netlify
- [ ] Clicou em "Testar Conexão" e recebeu ✓ verde
- [ ] Fez upload de um PDF de teste
- [ ] Enviou para 1–2 emails seus para confirmar recebimento
- [ ] Verificou o painel de Rastreamento após abrir o email de teste

---

## Arquivos de código presentes

- [ ] `src/netlify/functions/send-emails.js`
- [ ] `src/netlify/functions/test-connection.js`
- [ ] `src/netlify/functions/track-open.js`
- [ ] `src/netlify/functions/get-events.js`
- [ ] `src/netlify/functions/package.json`
- [ ] `src/pages/SetupPage.js`
- [ ] `src/pages/SendPage.js`
- [ ] `src/pages/ProgressPage.js`
- [ ] `src/pages/ResultsPage.js`
- [ ] `src/pages/TrackingPage.js`
- [ ] `src/App.js`
- [ ] `src/App.css`
- [ ] `src/index.js`
- [ ] `public/index.html`
- [ ] `netlify.toml`
- [ ] `package.json`

---

## Antes de cada campanha

- [ ] Lista de emails revisada (sem duplicatas, formato correto)
- [ ] Emails separados por ";" sem espaços extras
- [ ] PDF do currículo atualizado e com menos de 4 MB
- [ ] Assunto e corpo revisados
- [ ] Aba do navegador vai ficar aberta até o fim do envio
