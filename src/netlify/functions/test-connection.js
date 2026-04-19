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
        body: JSON.stringify({ error: 'Email e senha (App Password) são obrigatórios' })
      };
    }

    // Configuração mais explícita e confiável para Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,                    // ← use 587 com STARTTLS (mais estável)
      secure: false,                // false para 587, true para 465
      auth: {
        user: email,
        pass: password.trim()       // remove espaços acidentais
      },
      tls: {
        rejectUnauthorized: false   // ajuda em alguns ambientes serverless
      }
    });

    // Testa a conexão
    await transporter.verify();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Conexão com sucesso! SMTP configurado corretamente.'
      })
    };

  } catch (error) {
    console.error('Erro completo ao testar SMTP:', error);

    let errorMessage = 'Erro ao conectar com o servidor SMTP.';

    const errMsg = error.message.toLowerCase();

    if (errMsg.includes('invalid login') || errMsg.includes('535') || errMsg.includes('auth')) {
      errorMessage = 'Email ou App Password incorretos. Verifique suas credenciais do Gmail.';
    } 
    else if (errMsg.includes('getaddrinfo') || errMsg.includes('enotfound') || errMsg.includes('etimedout')) {
      errorMessage = 'Não foi possível conectar ao servidor do Gmail. Isso costuma acontecer em ambientes serverless (Netlify, Vercel, etc.).';
    } 
    else if (errMsg.includes('ECONNREFUSED')) {
      errorMessage = 'Conexão recusada. Verifique porta e configurações.';
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
