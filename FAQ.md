# ❓ FAQ - Perguntas Frequentes

Respostas para as dúvidas mais comuns ao usar a aplicação!

---

## ❌ PROBLEMAS COM GMAIL

### P: "Invalid login" - O que fazer?

**Resposta:**

Esse erro significa que você está usando a **senha errada**.

✅ **Você DEVE usar a SENHA DE APP** (16 dígitos), NÃO a senha normal do Gmail!

Como gerar:
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione:
   - App: "Mail"
   - Device: "Windows Computer"
3. Google gera uma senha de 16 caracteres
4. COPIE ESSA SENHA
5. Use na aplicação

**Importante**: 
- Não têm espaços na senha? Copie sem espaços
- A senha é de 16 dígitos, não de letras
- Verifique se você está copiando toda a senha

---

### P: "Too many login attempts" - Fui bloqueado!

**Resposta:**

Google bloqueou sua conta por tentar entrar muitas vezes com senha errada.

**O que fazer:**
1. **Aguarde 1 hora** antes de tentar novamente
2. Certifique-se de que está usando a SENHA DE APP
3. Acesse: https://accounts.google.com/signin/security
4. Verifique se há alertas de segurança
5. Tente novamente após 1 hora

---

### P: Não consigo acessar a página de senhas de app!

**Resposta:**

Isso acontece se:
- ✗ Sua conta tem autenticação de dois fatores desativada
- ✗ Você tem uma conta corporativa
- ✗ Você tem conta vinculada

**Solução:**
1. Vá para: https://myaccount.google.com/security
2. Ative "Verificação em duas etapas"
3. Espere 10 minutos
4. Agora acesse: https://myaccount.google.com/apppasswords

---

### P: Posso usar meu Gmail corporativo?

**Resposta:**

**Provavelmente não**. Emails corporativos (seu-email@suaempresa.com) têm restrições.

**Alternativas:**
1. Use seu Gmail pessoal (seu-email@gmail.com)
2. Contate o admin de TI da sua empresa
3. Use um Gmail novo criado para isso

---

## 📧 PROBLEMAS COM ENVIO

### P: Os emails não estão sendo enviados!

**Resposta:**

Verifique na ordem:

1. **Testou a conexão SMTP?**
   - Página 1: "Testar Conexão" deve mostrar ✓ verde
   - Se não, é um problema de Gmail

2. **A internet está funcionando?**
   - Abra outro site para testar
   - Verifique sua conexão

3. **O email é válido?**
   - Cada email deve ter: `algo@dominio.com`
   - Sem espaços extras
   - Verifique digitação

4. **Você tem limite de emails?**
   - Gmail permite ~500 emails/hora
   - Se passou disso, aguarde 1 hora

5. **A aba foi fechada?**
   - Se fechou durante envio, os emails agendados não saem
   - Mantenha aberta até fim!

---

### P: Quantos emails posso enviar por dia?

**Resposta:**

**Gmail SMTP**: Máximo ~500 emails/hora

**Exemplo de cronograma:**
- 100 emails = 16 minutos ✓
- 200 emails = 33 minutos ✓
- 500 emails = 1 hora 20 minutos ✓
- 600 emails = BLOQUEADO por 24h ✗

**Recomendação**: Não envie mais de 300/dia para ser seguro

---

### P: Preciso fechar a aba durante o envio?

**Resposta:**

**NÃO!** Mantenha a aba ABERTA a todo tempo!

**O que acontece se fechar:**
- Emails já enviados = OK ✓
- Emails agendados para enviar = ❌ Não saem

**Exemplo:**
- Você está em 30 de 100 emails
- Fecha a aba
- Só 30 saem, 70 não são enviados

---

### P: Posso enviar para um email errado e depois tentar de novo?

**Resposta:**

Sim, mas tenha cuidado!

**O que acontece:**
- Email errado (inválido) = Pode ir para spam ou voltar
- Emails duplicados = A pessoa recebe 2 vezes

**Melhor opção:**
1. Corrija a lista
2. Envie para os emails corretos em uma nova rodada
3. Espere 1-2 dias para enviar novamente para mesmos contatos

---

## 📄 PROBLEMAS COM PDF

### P: "PDF não reconhecido" - Qual é o problema?

**Resposta:**

Você está tentando enviar um arquivo que não é PDF válido.

**Checklist:**
1. ✓ O arquivo termina em `.pdf` ?
2. ✓ Você consegue abrir o PDF no seu computador?
3. ✓ O arquivo tem menos de 25MB?
4. ✓ O PDF não está corrompido?

**Solução:**
1. Tente com outro PDF primeiro (para testar)
2. Se esse funcionar, o problema é seu PDF
3. Re-converta seu currículo para PDF
4. Tente novamente

---

### P: Qual é o tamanho máximo do PDF?

**Resposta:**

**Tamanho máximo: 25MB**

Para um currículo, geralmente:
- Um PDF de currículo: 1-5MB ✓
- Currículo + portfólio: até 10MB ✓

Se passar de 25MB:
- Reduza as imagens
- Comprima o PDF
- Divida em múltiplos PDFs

---

### P: O PDF está sendo enviado?

**Resposta:**

Na página de resultados, você vê:

✓ **Enviado** = PDF foi anexado com sucesso
✗ **Erro** = Algo deu errado

**Se tiver erro:**
1. Verifique se seu PDF é válido
2. Tente novamente com um PDF diferente
3. Verifique tamanho (máx 25MB)

---

## 👥 PROBLEMAS COM EMAILS

### P: Como formatar a lista de emails?

**Resposta:**

**Formato correto:**
```
email1@example.com; email2@example.com; email3@example.com
```

**Pontos importantes:**
- Separador: `;` (ponto-e-vírgula)
- Sem espaços ANTES do email
- Sem espaços DEPOIS do email
- Pode ter espaço ANTES do `;`

**Exemplos:**
```
✓ rh@empresa1.com; contato@empresa2.com
✓ email1@company.com;email2@company.com
✗ rh@empresa1.com ,contato@empresa2.com (vírgula errada)
✗ rh@empresa1.com email2@company.com (sem separador)
✗ rh@empresa1.com; contato@empresa2.com; (espaço antes)
```

---

### P: Qual é o número máximo de emails por envio?

**Resposta:**

**Não há limite teórico**, mas:

**Prático:**
- Até 100 emails = 16 minutos ✓
- 100-300 emails = 30-50 minutos ✓
- 300-500 emails = 50-85 minutos ✓
- Mais de 500 = Risco de bloqueio ✗

**Recomendação:**
- Envie em lotes de **50-100 emails**
- Espere 1 dia entre lotes
- Isso é mais seguro

---

### P: Posso enviar para a mesma pessoa 2 vezes?

**Resposta:**

**Não recomendado**, mas tecnicamente pode:

**O que acontece:**
- Pessoa recebe 2 emails iguais
- Pode achar spam
- Pode marcar como spam
- Prejudica sua reputação

**Melhor opção:**
- Se errou: espere 3-5 dias e envie versão melhorada
- Se não respondeu: espere 2 semanas e envie com assunto diferente

---

## 🔐 SEGURANÇA

### P: Minha senha está segura?

**Resposta:**

**Sim!** A aplicação é segura porque:

✓ Você digita a senha a cada uso (não é salva)
✓ Usa HTTPS (criptografado)
✓ Sem armazenamento de dados sensíveis
✓ Netlify fornece segurança

**Boas práticas:**
- Só use a SENHA DE APP (não a senha principal)
- Se vazar, você pode revogar a senha de app em 10 segundos
- Nunca compartilhe a URL com outras pessoas
- Feche a aba depois de usar

---

### P: Preciso ativar "Acesso de apps menos seguros"?

**Resposta:**

**Não!** Não recomendado!

A SENHA DE APP é a forma segura:
- ✗ "Acesso de apps menos seguros" = Arriscado
- ✓ Senha de App = Seguro e recomendado

Sempre use a senha de app!

---

## 📊 RESULTADOS

### P: Qual é a taxa de resposta esperada?

**Resposta:**

Para emails de candidatura frias:

**Estatísticas reais:**
- 10% de emails que abrem a mensagem
- 2-5% que respondem
- 1-3% que chamam para entrevista

**Exemplo:**
- Enviar 100 emails
- ~10 abrem
- ~2-5 respondem
- ~1 chama para entrevista

**Tá ruim?** Não! É normal para emails frios.

---

### P: Como aumentar taxa de resposta?

**Resposta:**

1. **Personalize mais** (mencione a empresa)
2. **Aperfeiçoe seu currículo** (deixe mais atrativo)
3. **Melhore o email** (deixe mais profissional)
4. **Pesquise a empresa** (mostre que conhece)
5. **Envie para contato certo** (recrutador, não genérico)

---

### P: Devo enviar de novo para quem não respondeu?

**Resposta:**

**Sim!** Mas espere:

**Cronograma:**
- Email 1: Hoje
- Email 2: 7-10 dias depois (com variação no assunto)
- Email 3: 14-21 dias depois

**Exemplo:**
```
Email 1: "Candidatura - Desenvolvedor Full Stack"
Email 2: "Interesse na vaga de desenvolvedor"
Email 3: "Seguindo sua candidatura enviada"
```

---

## 🚀 OTIMIZAÇÃO

### P: Qual é a melhor hora para enviar emails?

**Resposta:**

**Melhores horários:**
- **Terça a Quinta**: 9h-11h ou 14h-16h (horário local)
- **Evitar**: Segunda cedo (abarrotado), Sexta tarde

**Estratégia:**
- Se enviar agora: alguns abrem hoje, alguns amanhã
- Melhor que nunca!

---

### P: Quantas rodadas de envio devo fazer?

**Resposta:**

**Estratégia recomendada:**

1. **Rodada 1**: 100 emails
   - Assunto: "Candidatura - [Posição]"
   - Aguarde 5-7 dias

2. **Rodada 2**: 100 emails novos
   - Assunto: Variado
   - Aguarde 5-7 dias

3. **Rodada 3**: Siga-up dos não respondidos
   - Assunto: "Seguindo candidatura enviada"

**Total esperado:**
- ~200 emails
- 2-3 semanas
- 10+ respostas esperadas

---

## 💡 DICAS GERAIS

### P: Qual é o segredo para conseguir emprego?

**Resposta:**

**Números!** Estatisticamente:

- 10 emails = Muito pouco
- 50 emails = Começa a funcionar
- 100 emails = Boa chance
- 200+ emails = Muito provável

**+  Qualidade:**
- Currículo bem feito
- Email personalizado
- Contatos certos (recrutadores)

**Fórmula:**
```
Muitos emails + Boa qualidade = Sucesso ✓
```

---

### P: Vale a pena usar essa ferramenta?

**Resposta:**

**SIM!** Vantagens:

✓ Económico (não precisa pagar)
✓ Rápido (enviar 100 emails em 16 minutos)
✓ Organizado (relatório de tudo)
✓ Escalável (pode fazer rodadas)

**Economiza:**
- Tempo (horas de digitação)
- Dinheiro (aplicações pagas custam $ 30-100/mês)
- Esforço (tudo automatizado)

---

## 📞 AINDA COM DÚVIDA?

Se não encontrou resposta aqui:

1. **Verifique README.md** (documentação técnica)
2. **Verifique DEPLOYMENT_GUIDE.md** (deploy)
3. **Verifique COMO_ENCONTRAR_EMAILS.md** (montar lista)
4. **Verifique EXEMPLO_EMAIL.md** (modelos de email)

---

**Última atualização**: 19 de Abril de 2026
