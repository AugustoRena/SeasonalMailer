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

const injectTrackingPixel = (htmlBody, email, campaignId, baseUrl) => {
  const encodedEmail = encodeURIComponent(email);
  const encodedCampaign = encodeURIComponent(campaignId);
  const pixelUrl = `${baseUrl}/.netlify/functions/track-open?email=${encodedEmail}&campaign=${encodedCampaign}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none" alt="" />`;
  // Inject before </body> if present, otherwise append
  return htmlBody.includes('</body>')
    ? htmlBody.replace('</body>', `${pixel}</body>`)
    : htmlBody + pixel;
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

  const { batch, subject, body, attachmentBase64, attachmentFilename, campaignId, siteUrl } = parsed;

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
      let htmlBody = body.replace(/\n/g, '<br>');

      // Inject tracking pixel if campaign tracking is enabled
      if (campaignId && siteUrl) {
        htmlBody = injectTrackingPixel(htmlBody, recipient, campaignId, siteUrl);
      }

      const mailOptions = {
        from: gmailUser,
        to: recipient,
        subject,
        html: htmlBody
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

    if (i < batch.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ results })
  };
};
