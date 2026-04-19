import nodemailer from 'nodemailer';

const getMimeType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    txt: 'text/plain', zip: 'application/zip'
  };
  return types[ext] || 'application/octet-stream';
};

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
    const {
      recipients,
      subject,
      body,
      attachmentBase64,
      attachmentFilename
    } = JSON.parse(event.body);

    // Credentials come from environment variables — never from the client
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Credenciais não configuradas. Defina GMAIL_USER e GMAIL_APP_PASSWORD nas variáveis de ambiente do Netlify.'
        })
      };
    }

    if (!recipients || !subject || !body) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Campos obrigatórios faltando: recipients, subject, body' })
      };
    }

    // Validate attachment size (~4 MB limit before Base64 inflation)
    if (attachmentBase64 && attachmentBase64.length > 5_300_000) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Arquivo muito grande. O limite é de aproximadamente 4 MB.' })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    const emailList = recipients
      .split(';')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const results = [];
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emailList.length; i++) {
      const recipient = emailList[i];

      try {
        const mailOptions = {
          from: gmailUser,
          to: recipient,
          subject: subject,
          html: body.replace(/\n/g, '<br>')
        };

        if (attachmentBase64 && attachmentFilename) {
          // Resolve MIME type dynamically — no longer hardcoded to application/pdf
          const detectedType = getMimeType(attachmentFilename);
          mailOptions.attachments = [
            {
              filename: attachmentFilename,
              content: Buffer.from(attachmentBase64, 'base64'),
              contentType: detectedType
            }
          ];
        }

        await transporter.sendMail(mailOptions);

        results.push({ email: recipient, status: 'enviado', timestamp: new Date().toISOString() });
        sent++;

        if (i < emailList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      } catch (error) {
        results.push({ email: recipient, status: 'erro', error: error.message, timestamp: new Date().toISOString() });
        failed++;
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: `Campanha concluída. ${sent} enviados, ${failed} com erro.`,
        summary: { total: emailList.length, sent, failed },
        results
      })
    };
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Erro ao processar envio', details: error.message })
    };
  }
};
