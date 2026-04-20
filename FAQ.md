# FAQ — SeasonalMailer

---

## Gmail

**"Invalid login" ao testar conexão**
Você está usando a senha normal do Gmail. Use a senha de app (16 caracteres)
gerada em https://myaccount.google.com/apppasswords.

**Não consigo acessar a página de senhas de app**
A autenticação em dois fatores precisa estar ativa. Ative em
https://myaccount.google.com/security, aguarde alguns minutos e tente novamente.
Se a conta for corporativa (@suaempresa.com), o administrador de TI pode ter
desativado esse recurso — use um Gmail pessoal nesses casos.

**"Too many login attempts"**
O Google bloqueou a conta por múltiplas tentativas com senha errada.
Aguarde 1 hora e tente novamente com a senha de app correta.

**Quantos emails posso enviar?**
O limite do Gmail via SMTP é de ~500 emails por hora.
Recomendado: até 300 por campanha por dia para evitar bloqueio.
Com o delay de 10 segundos, 300 emails levam ~50 minutos.

---

## Envio

**O envio para após alguns emails**
Mantenha a aba aberta durante todo o processo. Se a aba for fechada ou
o computador entrar em suspensão, os lotes seguintes não são enviados.
Os emails já enviados não são desfeitos.

**Erro "Arquivo muito grande"**
O PDF precisa ter menos de 4 MB. Comprima o arquivo ou reduza as imagens
nele antes de tentar novamente.

**Formato correto da lista de emails**
Separe com ponto-e-vírgula e espaço:
`email1@empresa.com; email2@empresa.com; email3@empresa.com`
A aplicação remove espaços extras e ignora entradas vazias.

**Posso reenviar para quem não respondeu?**
Sim. Espere pelo menos 7 dias e use um assunto diferente.
Reenviar em menos de 3 dias aumenta o risco de ser marcado como spam.

---

## Rastreamento

**O painel de rastreamento não mostra nada**
Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão configurados
nas variáveis de ambiente do Netlify e se um novo deploy foi feito depois.
Confirme também que o SQL de setup foi executado no Supabase.

**Apareceram aberturas que eu não fiz**
Normal. O Apple Mail desde 2021 pré-carrega imagens automaticamente,
registrando abertura sem o destinatário ter lido. Clientes como Gmail
web e Outlook mobile também podem pré-buscar imagens em certas condições.
A precisão real do rastreamento por pixel gira em torno de 60–70%.

**Uma pessoa aparece como abriu várias vezes**
A função `track-open` faz deduplicação: registra apenas a primeira abertura
por combinação de email + campanha. Múltiplas entradas para a mesma pessoa
indicam que o cliente de email fez múltiplas requisições em momentos diferentes
(algumas horas ou dias depois), o que a deduplicação não cobre.

**O cliente de email identificado está errado**
A identificação é feita pelo User-Agent enviado na requisição da imagem.
Clientes que usam proxies de privacidade (como o Apple Mail Privacy Protection)
passam um User-Agent genérico do servidor Apple, não do dispositivo real.

---

## Deploy / Netlify

**Build falha com erro de ESLint**
O React Scripts no modo CI trata warnings como erros.
Verifique a mensagem exata nos logs do Netlify e corrija o arquivo indicado.

**Função retorna erro 500 no primeiro uso**
As variáveis de ambiente não foram lidas pelo build atual.
Salve todas as variáveis e dispare um novo deploy em Deploys → Trigger deploy.

**A URL do Netlify abre mas a tela fica em branco**
Abra o console do navegador (F12 → Console) e procure o erro.
O mais comum é um arquivo JS que não foi gerado corretamente no build.
Verifique os logs de build no Netlify.

**Como atualizar a aplicação após uma mudança no código?**
Faça commit e push para o GitHub. O Netlify detecta automaticamente
e inicia um novo deploy.

---

## Segurança

**Minha senha do Gmail está segura?**
Sim. As credenciais ficam apenas nas variáveis de ambiente do Netlify —
nunca são enviadas ao navegador. A aplicação usa a senha de app, que pode
ser revogada individualmente sem afetar sua senha principal do Google.

**Posso compartilhar a URL do Netlify com outras pessoas?**
Cuidado. Qualquer pessoa com a URL pode usar a tela de Testar Conexão
(que confirma se o Gmail está configurado) e ver o painel de rastreamento.
Se isso for uma preocupação, adicione autenticação básica pelo Netlify
(Site settings → Access control → Basic password protection).
