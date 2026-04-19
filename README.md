# Email Campaign Sender 📧

Aplicação React para envio de emails em massa com anexo de PDF, usando Netlify Functions e SMTP do Gmail.

## 🚀 Funcionalidades

- ✅ Página de configuração com teste de conexão SMTP
- ✅ Upload de arquivo PDF (currículo)
- ✅ Envio para múltiplos emails (separados por `;`)
- ✅ Delay de 10 segundos entre cada envio
- ✅ Barra de progresso em tempo real
- ✅ Relatório detalhado de envios
- ✅ Interface responsiva e profissional

## 📋 Pré-requisitos

- Node.js 16+ instalado
- Conta no GitHub
- Conta no Netlify conectada ao GitHub
- Email Gmail com **senha de app** gerada

### Gerar Senha de App do Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione "Mail" e "Windows Computer" (ou seu dispositivo)
3. Copie a senha gerada (16 dígitos)
4. **Use essa senha, não sua senha normal do Gmail**

## 🏗️ Estrutura do Projeto

```
email-campaign-sender/
├── netlify/
│   └── functions/
│       ├── test-connection.js    # Teste de conexão SMTP
│       └── send-emails.js        # Envio de emails
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── pages/
│       ├── SetupPage.js
│       ├── SendPage.js
│       ├── ProgressPage.js
│       └── ResultsPage.js
├── package.json
├── netlify.toml
└── .gitignore
```

## 🔧 Instalação Local

### 1. Clone ou crie o repositório

```bash
# Se estiver começando do zero
git init
git remote add origin https://github.com/seu-usuario/email-campaign-sender.git
git branch -M main
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale o Netlify CLI (opcional, para testar local)

```bash
npm install -g netlify-cli
```

### 4. Teste localmente (opcional)

```bash
# Com Netlify CLI
netlify dev

# Ou com React Scripts
npm start
```

## 🌐 Deploy no Netlify

### Opção 1: Via GitHub (Recomendado)

1. **Crie um repositório no GitHub**
   - Vá para https://github.com/new
   - Crie um novo repositório (pode ser privado)

2. **Push do código**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```

3. **Conecte no Netlify**
   - Vá para https://app.netlify.com
   - Clique em "New site from Git"
   - Selecione seu repositório GitHub
   - Build command: `npm run build`
   - Publish directory: `build`
   - **IMPORTANTE**: Mantenha as variáveis de ambiente vazias (o usuário preencherá no formulário)

4. **Deploy automático**
   - A cada push no GitHub, Netlify fará deploy automaticamente

### Opção 2: Deploy Manual

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## 📖 Como Usar

1. **Acesse a aplicação**
   - URL: `https://seu-site.netlify.app`

2. **Configure o Email (Página 1)**
   - Email: seu-email@gmail.com
   - Senha: sua senha de app (16 dígitos)
   - Clique em "Testar Conexão"
   - Se OK, você será direcionado para a página de envio

3. **Envie os Emails (Página 2)**
   - Faça upload do seu PDF (currículo)
   - Cole os emails separados por `;`
   - Escreva o assunto do email
   - Escreva o corpo do email
   - Clique em "Enviar"

4. **Acompanhe o Progresso**
   - Veja a barra de progresso em tempo real
   - Cada email leva 10 segundos para ser enviado

5. **Veja os Resultados**
   - Tabela com status de cada email
   - Quantidade de sucessos e erros

## ⚠️ Pontos Importantes

### Segurança
- **Nunca** armazene senhas em variáveis de ambiente público
- O usuário digita a senha a cada uso
- Senhas não são salvas no navegador
- Use HTTPS (Netlify fornece automaticamente)

### Limitações do Gmail
- Máximo ~500 emails/hora via SMTP
- Se receber erro de "login inválido":
  1. Verifique a senha de app (16 dígitos, sem espaços)
  2. Ative "Acesso de apps menos seguros" se necessário
  3. Verifique se está usando @gmail.com

### Performance
- Delay de 10 segundos garante estabilidade
- Para 100 emails = ~16 minutos
- Mantenha a aba aberta durante envio
- Se a aba fechar, os emails agendados podem não ser enviados

## 🛠️ Troubleshooting

### "Invalid login"
- Verifique se está usando a **senha de app** (16 dígitos), não a senha normal

### "Too many login attempts"
- Aguarde 1 hora antes de tentar novamente
- Google bloqueia múltiplas tentativas falhadas

### PDF não sai anexado
- Verifique se o arquivo é um PDF válido
- Tamanho máximo: 25MB

### Emails não estão sendo enviados
- Verifique a internet
- Teste a conexão novamente
- Veja o console (F12 > Console) para erros

## 📚 Variáveis de Ambiente (Netlify)

Você **NÃO** precisa definir variáveis de ambiente para esse projeto.
O usuário insere email e senha diretamente na interface.

## 🤝 Contribuindo

Sinta-se livre para fazer fork e enviar pull requests!

## 📄 Licença

MIT License

## 📞 Suporte

Se tiver dúvidas:
1. Verifique se está usando a senha de app (não a senha normal)
2. Teste a conexão SMTP antes de enviar
3. Verifique os logs do Netlify (Functions tab)

---

Desenvolvido com ❤️
