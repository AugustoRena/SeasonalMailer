// Sends a single batch of emails (up to 2 at a time).
// The frontend calls this repeatedly, one batch per request,
// so each call stays well under Netlify's 26s timeout.

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
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Método não permitido' }) };
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Credenciais não configuradas. Defina GMAIL_USER e GMAIL_APP_PASSWORD no Netlify.' })
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Body inválido' }) };
  }

  const { batch, subject, body, attachmentBase64, attachmentFilename } = parsed;
  // batch = array of email strings for this call (max 2)

  if (!batch || !Array.isArray(batch) || batch.length === 0 || !subject || !body) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Campos obrigatórios faltando' }) };
  }

  if (attachmentBase64 && attachmentBase64.length > 5_300_000) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Arquivo muito grande. Limite: ~4 MB.' }) };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  const results = [];

  for (let i = 0; i < batch.length; i++) {
    const recipient = batch[i];
    try {
      const mailOptions = {
        from: gmailUser,
        to: recipient,
        subject,
        html: body.replace(/\n/g, '<br>')
      };

      if (attachmentBase64 && attachmentFilename) {
        mailOptions.attachments = [{
          filename: attachmentFilename,
          content: Buffer.from(attachmentBase64, 'base64'),
          contentType: getMimeType(attachmentFilename)
        }];
      }

      await transporter.sendMail(mailOptions);
      results.push({ email: recipient, status: 'enviado', timestamp: new Date().toISOString() });
    } catch (err) {
      results.push({ email: recipient, status: 'erro', error: err.message, timestamp: new Date().toISOString() });
    }

    // 10s delay between emails within the batch, but not after the last one
    if (i < batch.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ results })
  };
};
