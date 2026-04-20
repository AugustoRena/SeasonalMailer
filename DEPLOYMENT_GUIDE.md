# Guia de Deploy — SeasonalMailer

---

## Pré-requisitos

- Node.js 18+ instalado localmente (só para testar local; não obrigatório para deploy)
- Conta no GitHub
- Conta no Netlify
- Conta no Supabase
- Gmail com senha de app gerada

---

## 1. Supabase

1. Crie um projeto em https://supabase.com (região mais próxima de você)
2. No painel, vá em **SQL Editor** e execute o arquivo `SUPABASE_SETUP.sql`
3. Vá em **Project Settings → API** e copie:
   - **Project URL** (ex: `https://xyzxyz.supabase.co`)
   - **service_role key** (em "Project API keys" — use essa, não a anon key)

---

## 2. GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/seasonal-mailer.git
git push -u origin main
```

Confirme no navegador que todos os arquivos aparecem no repositório.

---

## 3. Netlify

### Criar o site

1. Em https://app.netlify.com, clique em **Add new site → Import an existing project**
2. Selecione **GitHub**, autorize e escolha o repositório
3. As configurações abaixo já estão no `netlify.toml` — não altere:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `src/netlify/functions`
4. Clique em **Deploy site**

### Variáveis de ambiente

Em **Site settings → Environment variables**, adicione:

| Variável | Valor |
|---|---|
| `GMAIL_USER` | seu-email@gmail.com |
| `GMAIL_APP_PASSWORD` | senha de app de 16 caracteres |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | service_role key do Supabase |

Após salvar, vá em **Deploys → Trigger deploy** para o build rodar com as novas variáveis.

---

## 4. Verificar o deploy

1. Acesse a URL gerada pelo Netlify (ex: `https://seu-site.netlify.app`)
2. Clique em **Testar Conexão**
3. Deve aparecer ✓ verde com o email configurado

Se aparecer erro:
- Verifique os logs em **Netlify → Functions → test-connection → Recent logs**
- Confirme que as 4 variáveis estão salvas corretamente
- Faça um novo deploy após corrigir

---

## 5. Testar envio e rastreamento

1. Na aba **Enviar**, envie um email de teste para você mesmo
2. Abra o email recebido
3. Vá na aba **Rastreamento** — a abertura deve aparecer em até 30 segundos
4. Se não aparecer, verifique `SUPABASE_URL` e `SUPABASE_SERVICE_KEY`

---

## Deploy automático

Após a configuração inicial, qualquer `git push` para a branch `main`
dispara um novo deploy automaticamente no Netlify.

```bash
# Para atualizar a aplicação:
git add .
git commit -m "descrição da mudança"
git push
```

---

## Testar localmente (opcional)

```bash
npm install -g netlify-cli
npm install
netlify dev
```

Crie um arquivo `.env` na raiz com as variáveis de ambiente para o teste local:

```
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=suasenha
SUPABASE_URL=https://xyzxyz.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key
```

> Nunca faça commit do arquivo `.env` — ele já está no `.gitignore`.

---

## Resolução de problemas de deploy

**Build falha com erro de ESLint**
Verifique se há warnings de lint no código. Em ambiente CI, o React Scripts
trata warnings como erros. Veja a mensagem de erro nos logs do Netlify.

**Função retorna 500 logo de cara**
As variáveis de ambiente não estão sendo lidas. Confirme que o deploy foi
feito *após* salvar as variáveis.

**Função não encontrada (404)**
Confirme que `netlify.toml` tem `functions = "src/netlify/functions"` e que
o diretório existe no repositório com os arquivos `.js` dentro.
