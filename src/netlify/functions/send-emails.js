import nodemailer from 'nodemailer';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { 
      email, 
      password, 
      recipients, 
      subject, 
      body, 
      attachmentBase64, 
      attachmentFilename 
    } = JSON.parse(event.body);

    if (!email || !password || !recipients || !subject || !body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados obrigatórios faltando' })
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

    // Parse dos emails
    const emailList = recipients
      .split(';')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const results = [];
    let sent = 0;
    let failed = 0;

    // Enviar emails com delay de 10 segundos
    for (let i = 0; i < emailList.length; i++) {
      const recipient = emailList[i];
      
      try {
        const mailOptions = {
          from: email,
          to: recipient,
          subject: subject,
          html: body.replace(/\n/g, '<br>')
        };

        // Adicionar anexo se existir
        if (attachmentBase64 && attachmentFilename) {
          mailOptions.attachments = [
            {
              filename: attachmentFilename,
              content: Buffer.from(attachmentBase64, 'base64'),
              contentType: 'application/pdf'
            }
          ];
        }

        await transporter.sendMail(mailOptions);
        
        results.push({
          email: recipient,
          status: 'enviado',
          timestamp: new Date().toISOString()
        });
        sent++;

        // Delay de 10 segundos (exceto no último email)
        if (i < emailList.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      } catch (error) {
        results.push({
          email: recipient,
          status: 'erro',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        failed++;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Campanha concluída. ${sent} enviados, ${failed} com erro.`,
        summary: {
          total: emailList.length,
          sent: sent,
          failed: failed
        },
        results: results
      })
    };
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro ao processar envio',
        details: error.message
      })
    };
  }
};
