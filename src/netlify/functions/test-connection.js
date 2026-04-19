import nodemailer from 'nodemailer';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email e senha são obrigatórios' })
      };
    }

    // Configuração específica para BOL (@bol.com.br)
    const transporter = nodemailer.createTransport({
      host: 'smtps.bol.com.br',     // Servidor oficial do BOL
      port: 465,                    // Porta com SSL (mais estável)
      secure: true,                 // true porque é porta 465 (SSL/TLS implícito)
      auth: {
        user: email,                // deve ser seuemail@bol.com.br
        pass: password       // remove espaços acidentais
      },
      tls: {
        rejectUnauthorized: false   // ajuda em ambientes serverless como Netlify
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    // Testa a conexão
    await transporter.verify();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Conexão com BOL realizada com sucesso!'
      })
    };

  } catch (error) {
    console.error('Erro completo ao testar SMTP BOL:', error);

    const errMsg = (error.message || '').toLowerCase();
    let errorMessage = 'Erro ao conectar com o servidor SMTP do BOL.';

    if (errMsg.includes('authentication') || errMsg.includes('login') || errMsg.includes('535') || errMsg.includes('auth')) {
      errorMessage = 'Email ou senha incorretos. Verifique suas credenciais do BOL.';
    } 
    else if (errMsg.includes('getaddrinfo') || errMsg.includes('enotfound') || errMsg.includes('etimedout') || errMsg.includes('econnrefused')) {
      errorMessage = 'Não foi possível conectar ao servidor do BOL. Isso pode ocorrer em ambientes serverless (Netlify). Tente novamente ou use a porta 587.';
    } 
    else if (errMsg.includes('certificate') || errMsg.includes('tls')) {
      errorMessage = 'Erro de certificado. Tente novamente.';
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: errorMessage,
        details: error.message,
        code: error.code
      })
    };
  }
};
