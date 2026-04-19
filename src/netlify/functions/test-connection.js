import nodemailer from 'nodemailer';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Credentials from environment variables only
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Credenciais não configuradas no servidor. Defina GMAIL_USER e GMAIL_APP_PASSWORD nas variáveis de ambiente do Netlify.'
        })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    await transporter.verify();

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: `Conexão com sucesso! ${gmailUser} configurado corretamente.`
      })
    };
  } catch (error) {
    console.error('Erro ao testar conexão:', error);

    let errorMessage = 'Erro ao conectar com o servidor SMTP.';

    if (error.message.includes('Invalid login') || error.message.includes('Username and Password')) {
      errorMessage = 'Credenciais SMTP inválidas. Verifique GMAIL_USER e GMAIL_APP_PASSWORD no painel do Netlify.';
    } else if (error.message.includes('getaddrinfo')) {
      errorMessage = 'Erro de DNS: não foi possível resolver o servidor SMTP. Verifique a conectividade do servidor.';
    }

    // 400 (invalid credentials/config) — not 401 (HTTP auth challenge)
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: errorMessage, details: error.message })
    };
  }
};
