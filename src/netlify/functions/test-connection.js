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

    // Criar transportador
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });

    // Verificar conexão
    await transporter.verify();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Conexão com sucesso! Email configurado corretamente.' 
      })
    };
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    
    let errorMessage = 'Erro ao conectar com o servidor SMTP';
    
    if (error.message.includes('Invalid login')) {
      errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
    } else if (error.message.includes('getaddrinfo')) {
      errorMessage = 'Erro de conexão com o servidor. Verifique sua internet.';
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message
      })
    };
  }
};
