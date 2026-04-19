// Netlify Background Function — timeout de 15 minutos (vs 26s das funções normais)
// O nome DEVE terminar em "-background" para o Netlify reconhecer como background function.
// Retorna 202 imediatamente; o frontend consulta o progresso via /job-status.

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

// In-memory job store — persists for the lifetime of the function instance.
// For multi-instance deploys, replace with KV store (Netlify Blobs, Upstash, etc.)
export const jobs = {};

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

  const { recipients, subject, body, attachmentBase64, attachmentFilename } = parsed;

  if (!recipients || !subject || !body) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Campos obrigatórios faltando' }) };
  }

  if (attachmentBase64 && attachmentBase64.length > 5_300_000) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Arquivo muito grande. Limite: ~4 MB.' }) };
  }

  const emailList = recipients.split(';').map(e => e.trim()).filter(e => e.length > 0);
  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Register job immediately so polling can find it
  jobs[jobId] = {
    status: 'running',
    total: emailList.length,
    sent: 0,
    failed: 0,
    current: 0,
    results: []
  };

  // Run sends asynchronously — background functions keep running after the 202 response
  (async () => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    for (let i = 0; i < emailList.length; i++) {
      const recipient = emailList[i];
      jobs[jobId].current = i + 1;

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
        jobs[jobId].sent++;
        jobs[jobId].results.push({ email: recipient, status: 'enviado', timestamp: new Date().toISOString() });
      } catch (err) {
        jobs[jobId].failed++;
        jobs[jobId].results.push({ email: recipient, status: 'erro', error: err.message, timestamp: new Date().toISOString() });
      }

      if (i < emailList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    jobs[jobId].status = 'done';
  })();

  // Return 202 immediately — frontend polls /job-status?jobId=...
  return {
    statusCode: 202,
    headers: CORS_HEADERS,
    body: JSON.stringify({ jobId, total: emailList.length })
  };
};
