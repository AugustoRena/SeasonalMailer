# ✅ CHECKLIST COMPLETO

Use este checklist para garantir que você não esqueceu nada!

---

## 📋 PRÉ-REQUISITOS

- [ ] Você tem acesso a um computador com internet
- [ ] Você tem uma conta no Gmail (seu-email@gmail.com)
- [ ] Você tem conta no GitHub (crie em https://github.com/join se não tiver)
- [ ] Você tem conta no Netlify (crie em https://app.netlify.com se não tiver)
- [ ] Você tem um currículo em PDF pronto
- [ ] Você leu **QUICK_START.txt** ou **COMECE_AQUI.txt**

---

## 🔐 PASSO 1: GMAIL

### Gerar Senha de App:
- [ ] Acesse: https://myaccount.google.com/apppasswords
- [ ] Selecione "Mail" como app
- [ ] Selecione "Windows Computer" (ou seu dispositivo)
- [ ] Google gera uma senha de 16 caracteres
- [ ] **COPIE E GUARDE ESSA SENHA** em um lugar seguro
- [ ] Confirme que é uma senha de 16 dígitos (não letras/caracteres especiais)

### Verificação:
- [ ] A senha tem 16 caracteres?
- [ ] Você consegue copiá-la sem problemas?
- [ ] Você guardou em lugar seguro?

---

## 💻 PASSO 2: GITHUB

### Criar Repositório:
- [ ] Acesse: https://github.com/new
- [ ] Preencha:
  - [ ] Name: `email-campaign-sender`
  - [ ] Description: `Email campaign sender with PDF attachments`
  - [ ] Visibility: Public ou Private (escolha sua preferência)
- [ ] Clique em "Create repository"
- [ ] **COPIE A URL DO REPOSITÓRIO**

### Exemplo de URL:
- [ ] Sua URL parece com: `https://github.com/seu-usuario/email-campaign-sender.git`

---

## 📁 PASSO 3: ARQUIVOS

### Download:
- [ ] Você baixou TODOS os arquivos da pasta outputs?
- [ ] Você salvou em uma pasta local? (ex: `C:\email-campaign-sender\`)

### Verifique se você tem:
- [ ] `package.json`
- [ ] `netlify.toml`
- [ ] `.gitignore`
- [ ] Pasta `src/` com:
  - [ ] `App.js`
  - [ ] `App.css`
  - [ ] `index.js`
  - [ ] Pasta `pages/` com:
    - [ ] `SetupPage.js`
    - [ ] `SendPage.js`
    - [ ] `ProgressPage.js`
    - [ ] `ResultsPage.js`
- [ ] Pasta `netlify/functions/` com:
  - [ ] `test-connection.js`
  - [ ] `send-emails.js`
- [ ] Pasta `public/` com:
  - [ ] `index.html`
- [ ] Arquivos de documentação:
  - [ ] `README.md`
  - [ ] `DEPLOYMENT_GUIDE.md`
  - [ ] `COMECE_AQUI.txt`
  - [ ] `QUICK_START.txt`
  - [ ] `FAQ.md`
  - [ ] `COMO_ENCONTRAR_EMAILS.md`
  - [ ] `EXEMPLO_EMAIL.md`

---

## 🚀 PASSO 4: UPLOAD PARA GITHUB

### Via GitHub Desktop:
- [ ] Você tem GitHub Desktop instalado?
- [ ] Você abriu GitHub Desktop?
- [ ] Você fez login no GitHub?
- [ ] Você clonou o repositório?
- [ ] Você copiou os arquivos para dentro da pasta clonada?
- [ ] Você fez Commit com mensagem "Initial commit"?
- [ ] Você fez Push para o GitHub?

### Via Terminal:
- [ ] Você navegou para a pasta correta?
- [ ] Você rodou `git init`?
- [ ] Você rodou `git add .`?
- [ ] Você rodou `git commit -m "Initial commit"`?
- [ ] Você rodou `git branch -M main`?
- [ ] Você rodou `git remote add origin [URL]`?
- [ ] Você rodou `git push -u origin main`?

### Verificação:
- [ ] Você acessa https://github.com/seu-usuario/email-campaign-sender?
- [ ] Você vê todos os arquivos lá?

---

## 🌐 PASSO 5: NETLIFY DEPLOY

### Preparação:
- [ ] Você tem conta no Netlify?
- [ ] Você fez login no Netlify?
- [ ] Você autorizou o Netlify a acessar seu GitHub?

### Deploy:
- [ ] Você clicou em "Add new site"?
- [ ] Você selecionou "Import an existing project"?
- [ ] Você selecionou GitHub como provedor?
- [ ] Você selecionou seu repositório `email-campaign-sender`?
- [ ] Você configurou:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `build`
  - [ ] Functions directory: `netlify/functions`
- [ ] Você clicou em "Deploy site"?
- [ ] Você aguardou 2-5 minutos pelo deploy terminar?

### Verificação:
- [ ] Você tem uma URL tipo: `https://seu-site-aleatorio.netlify.app`?
- [ ] Você consegue acessar essa URL?
- [ ] A página aparece sem erros?

---

## 🧪 PASSO 6: TESTAR APLICAÇÃO

### Teste de Conexão SMTP:
- [ ] Você acessou a URL do Netlify?
- [ ] Você vê a página com campo de email e senha?
- [ ] Você preencheu o email: `seu-email@gmail.com`?
- [ ] Você preencheu a senha de app (16 dígitos)?
- [ ] Você clicou em "Testar Conexão"?
- [ ] Você vê mensagem verde ✓ "Conexão com sucesso"?

### Teste de Interface:
- [ ] Você foi direcionado para página de envio?
- [ ] Você consegue fazer upload de um PDF?
- [ ] Você consegue digitar uma lista de emails?
- [ ] Você consegue escrever assunto e corpo?
- [ ] Todos os campos aparecem sem erro?

---

## 📧 PASSO 7: PREPARAR EMAILS

### Currículo:
- [ ] Seu PDF está pronto?
- [ ] Seu PDF é válido (consegue abrir)?
- [ ] Seu PDF tem menos de 25MB?
- [ ] Seu PDF tem seu nome/contato?

### Lista de Emails:
- [ ] Você tem pelo menos 10 emails? (recomendado: 50+)
- [ ] Todos os emails são válidos? (algo@dominio.com)
- [ ] Você os separou com ";"?
- [ ] Você não tem emails duplicados?

### Email/Assunto:
- [ ] Você escreveu um assunto profissional?
- [ ] Você escreveu o corpo do email?
- [ ] Você revisou para erros de digitação?
- [ ] Você não tem informações sensíveis?

### Exemplos (se precisar):
- [ ] Você leu **EXEMPLO_EMAIL.md** para inspiração?
- [ ] Você leu **COMO_ENCONTRAR_EMAILS.md** para mais contatos?

---

## 🚀 PASSO 8: PRIMEIRO ENVIO

### Preparação:
- [ ] Você está na página de envio da aplicação?
- [ ] Você tem tudo pronto (PDF, emails, assunto, corpo)?
- [ ] Você vai manter a aba ABERTA durante todo o envio?

### Envio:
- [ ] Você fez upload do PDF?
- [ ] Você colou a lista de emails?
- [ ] Você preencheu o assunto?
- [ ] Você preencheu o corpo?
- [ ] Você clicou em "Enviar"?

### Acompanhamento:
- [ ] Você vê a página de progresso?
- [ ] Você vê a barra de progresso se movendo?
- [ ] Você vê contador de emails enviados?
- [ ] A aba continua aberta? (IMPORTANTE!)

### Resultados:
- [ ] O envio foi concluído?
- [ ] Você vê o relatório final?
- [ ] Quantos emails foram enviados com sucesso?
- [ ] Houve algum erro?

---

## ✅ APÓS PRIMEIRO ENVIO

- [ ] Você viu emails chegando? (cheque sua caixa de entrada)
- [ ] Tudo funcionou como esperado?
- [ ] Você entendeu como usar a ferramenta?

### Se algo deu errado:
- [ ] Você consultou **FAQ.md**?
- [ ] Você verificou o console (F12 > Console)?
- [ ] Você tentou a conexão SMTP novamente?

---

## 📊 PRÓXIMOS PASSOS

- [ ] Você vai enviar para mais emails?
- [ ] Você vai criar variações de email?
- [ ] Você vai esperar antes de enviar novamente para mesmos contatos?
- [ ] Você vai acompanhar respostas?

---

## 🎯 CHECKLIST FINAL

Antes de começar sua campanha massiva, confirme:

- [ ] Gmail funcionando ✓
- [ ] Netlify funcionando ✓
- [ ] Aplicação testada ✓
- [ ] PDF pronto ✓
- [ ] Emails coletados ✓
- [ ] Email escrito ✓
- [ ] Primeiro teste feito ✓

---

## 🎉 PARABÉNS!

Se você marcou todas as caixas acima, você está:

✅ Pronto para enviar centenas de candidaturas
✅ Pronto para começar sua busca por emprego
✅ Pronto para usar a ferramenta profissionalmente
✅ Pronto para o SUCESSO! 🚀

---

## 📝 ANOTAÇÕES PESSOAIS

Use esta seção para anotar informações importantes:

```
Meu email Gmail: ___________________________

Minha URL Netlify: ___________________________

Número de emails na lista: ___________________________

Data de primeiro envio: ___________________________

Respostas recebidas: ___________________________

Entrevistas conseguidas: ___________________________

Observações: 
_________________________________________________________________
_________________________________________________________________
```

---

**Boa sorte com suas candidaturas!** 💪🚀

Última atualização: 19 de Abril de 2026
