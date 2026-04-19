# GUIA DE DEPLOY - EMAIL CAMPAIGN SENDER 🚀

## 📝 PASSO 1: Preparar os Arquivos

Todos os arquivos da aplicação estão prontos! Você tem:

✅ `package.json` - Dependências do projeto
✅ `netlify.toml` - Configurações do Netlify
✅ `README.md` - Documentação completa
✅ `src/` - Componentes React
✅ `netlify/functions/` - Backend (Netlify Functions)
✅ `public/` - HTML principal

## 🔐 PASSO 2: Preparar Credenciais do Gmail

**Importante**: Use a SENHA DE APP, não a senha normal do Gmail!

1. Vá para: https://myaccount.google.com/apppasswords
2. Selecione:
   - App: "Mail"
   - Device: "Windows Computer" (ou seu dispositivo)
3. Google vai gerar uma senha de 16 caracteres
4. **COPIE ESSA SENHA** - você usará na aplicação

Exemplo: `abcd efgh ijkl mnop` (sem os espaços)

## 📦 PASSO 3: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - Name: `email-campaign-sender` (ou seu nome)
   - Description: "Envio de emails em massa"
   - Visibility: "Public" ou "Private" (como preferir)
3. Clique em "Create repository"

## 💻 PASSO 4: Fazer Upload do Código para GitHub

### Via Terminal (Recomendado):

```bash
# Navegue para a pasta do projeto
cd /caminho/para/email-campaign-sender

# Inicialize git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Adicione o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/email-campaign-sender.git

# Faça push
git push -u origin main
```

### Via GitHub Desktop:

1. Abra GitHub Desktop
2. File → Clone Repository
3. Selecione a aba "URL"
4. Cole a URL do seu repositório
5. Clique em "Clone"
6. Faça as alterações
7. Commit + Push

## 🌐 PASSO 5: Deploy no Netlify

### Opção A: Via GitHub (Mais Fácil)

1. Acesse: https://app.netlify.com
2. Clique em "Add new site" → "Import an existing project"
3. Selecione "GitHub"
4. Autorize o Netlify a acessar sua conta GitHub
5. Selecione o repositório `email-campaign-sender`
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Functions directory: `netlify/functions`
7. Clique em "Deploy site"
8. Aguarde (leva ~2 minutos)
9. Seu site estará em: `https://seu-site-aleatorio.netlify.app`

### Opção B: Via Netlify CLI

```bash
# Instale Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Deploy
netlify deploy --prod
```

## ✅ PASSO 6: Testar a Aplicação

1. Acesse a URL gerada pelo Netlify
2. Na página de Setup:
   - Email: seu-email@gmail.com
   - Senha: sua senha de app (16 dígitos)
3. Clique em "Testar Conexão"
4. Se aparecer mensagem verde ✓, funcionou!

## 🎯 PASSO 7: Usar a Aplicação

### Primeira Vez:
1. Página de Setup aparece
2. Preencha email e senha do Gmail
3. Clique em "Testar Conexão"
4. Se OK, você entra na página de envio

### Páginas:

**1️⃣ Setup (Configuração)**
- Email Gmail
- Senha de App
- Botão "Testar Conexão"

**2️⃣ Send (Envio)**
- Upload do PDF (currículo)
- Lista de emails (separados por `;`)
- Assunto do email
- Corpo do email
- Botão "Enviar"

**3️⃣ Progress (Progresso)**
- Barra de progresso
- Contadores (enviados/erros)
- Email atual sendo processado

**4️⃣ Results (Resultados)**
- Resumo total
- Tabela com status de cada email
- Botão para voltar

## 📧 Exemplo de Uso

### Emails a Enviar:
```
rh@empresa1.com; contato@empresa2.com; jobs@empresa3.com
```

### Assunto:
```
Candidatura - Desenvolvedor Full Stack
```

### Corpo:
```
Olá,

Estou enviando meu currículo para a vaga de Desenvolvedor.

Tenho experiência em React, Node.js e banco de dados.

Fico no aguardo!

Atenciosamente,
João Silva
```

## ⚠️ CUIDADOS IMPORTANTES

1. **Senha é a DE APP, não a normal!**
   - Se usar a senha normal, vai dar erro "Invalid login"

2. **Cada email leva 10 segundos**
   - 10 emails = 1:40 minuto
   - 100 emails = 16 minutos
   - Mantenha a aba aberta!

3. **Sem limite de emails por dia**
   - Gmail permite ~500 emails/hora
   - Se passar disso, será bloqueado

4. **PDF deve ser válido**
   - Tamanho máximo: 25MB
   - Formato: .pdf

## 🔄 Deploy Automático

Após configurar no GitHub + Netlify:
- Toda vez que você fizer `git push`
- O Netlify faz deploy automaticamente
- Não precisa fazer nada manualmente!

## 🆘 Troubleshooting

### "Invalid login" no Setup
- Use a senha de app (16 dígitos), não a senha normal
- Copie novamente em: https://myaccount.google.com/apppasswords

### Emails não saem
- Verifique se a conexão foi testada OK (página 1)
- Verifique a internet
- Veja a aba "Functions" no dashboard Netlify para erros

### "Too many login attempts"
- Gmail bloqueou a conta por segurança
- Aguarde 1 hora
- Acesse: https://accounts.google.com/signin/security para verificar

## 📱 Acessar de Outros Dispositivos

Depois do deploy:
- Abra o navegador em qualquer dispositivo
- Cole a URL: `https://seu-site.netlify.app`
- Funciona em Desktop, Tablet e Mobile!

## 🎉 Pronto!

Sua aplicação está online e pronta para usar!

Qualquer dúvida, consulte o README.md completo.
