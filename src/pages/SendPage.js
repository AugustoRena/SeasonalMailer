import React, { useState } from 'react';
import ProgressPage from './ProgressPage';
import ResultsPage from './ResultsPage';

const MAX_PDF_BYTES = 4 * 1024 * 1024; // 4 MB
const BATCH_SIZE = 2; // max emails per request — keeps each call under 26s timeout

const SendPage = ({ onLogout }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [currentPage, setCurrentPage] = useState('form');
  const [progressData, setProgressData] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione um arquivo PDF válido');
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      alert(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Limite: 4 MB.`);
      e.target.value = '';
      return;
    }
    setPdfFile(file);
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();

    if (!pdfFile || !recipientEmails || !subject || !body) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const emails = recipientEmails.split(';').map(e => e.trim()).filter(e => e.length > 0);
    if (emails.length === 0) { alert('Adicione pelo menos um email'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter(e => !emailRegex.test(e));
    if (invalid.length > 0) { alert(`Emails inválidos: ${invalid.join(', ')}`); return; }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      const total = emails.length;

      setCurrentPage('progress');
      setProgressData({ total, current: 0, sent: 0, failed: 0 });

      const allResults = [];
      let sent = 0;
      let failed = 0;

      // Split into batches of BATCH_SIZE and call the function once per batch
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);

        try {
          const response = await fetch('/.netlify/functions/send-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batch,
              subject,
              body,
              attachmentBase64: base64,
              attachmentFilename: pdfFile.name
            })
          });

          const data = await response.json();

          if (!response.ok) {
            // Mark entire batch as failed if the function itself errored
            batch.forEach(email => {
              allResults.push({ email, status: 'erro', error: data.error, timestamp: new Date().toISOString() });
              failed++;
            });
          } else {
            data.results.forEach(r => {
              allResults.push(r);
              if (r.status === 'enviado') sent++; else failed++;
            });
          }
        } catch (err) {
          batch.forEach(email => {
            allResults.push({ email, status: 'erro', error: 'Falha de conexão', timestamp: new Date().toISOString() });
            failed++;
          });
        }

        // Update progress after each batch
        setProgressData({
          total,
          current: Math.min(i + BATCH_SIZE, total),
          sent,
          failed
        });
      }

      setResultsData({
        success: true,
        message: `Campanha concluída. ${sent} enviados, ${failed} com erro.`,
        summary: { total, sent, failed },
        results: allResults
      });
      setCurrentPage('results');
    };

    reader.readAsDataURL(pdfFile);
  };

  if (currentPage === 'progress') {
    return <ProgressPage progressData={progressData} />;
  }

  if (currentPage === 'results') {
    return (
      <ResultsPage
        resultsData={resultsData}
        onBack={() => {
          setCurrentPage('form');
          setPdfFile(null);
          setRecipientEmails('');
          setSubject('');
          setBody('');
        }}
      />
    );
  }

  return (
    <div className="send-page">
      <div className="send-header">
        <div className="header-left">
          <h1>Enviar Emails em Massa</h1>
        </div>
        <button className="button-logout" onClick={onLogout}>Sair</button>
      </div>

      <div className="send-card">
        <form onSubmit={handleSendEmails}>
          <div className="form-section">
            <div className="section-title">📎 Anexar Currículo (PDF)</div>
            <div className="file-upload">
              <input type="file" id="pdf-input" className="file-input" accept=".pdf" onChange={handleFileChange} />
              <label htmlFor="pdf-input" className="file-upload-label">
                <span className="file-upload-icon">📄</span>
                <span className="file-upload-text">Clique para selecionar seu PDF (máx. 4 MB)</span>
                {pdfFile && <span className="file-name">✓ {pdfFile.name} ({(pdfFile.size / 1024).toFixed(0)} KB)</span>}
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">👥 Lista de Destinatários</div>
            <div className="form-group">
              <label className="form-label">Emails (separados por ";")</label>
              <textarea
                className="textarea"
                placeholder="email1@example.com; email2@example.com; email3@example.com"
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
              />
              <div className="char-count">
                {recipientEmails.split(';').filter(e => e.trim()).length} email(s)
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">✉️ Conteúdo do Email</div>
            <div className="form-grid">
              <div>
                <label className="form-label">Assunto</label>
                <input
                  type="text" className="form-input"
                  placeholder="Ex: Candidatura - Vaga de Desenvolvedor"
                  value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100}
                />
                <div className="char-count">{subject.length}/100</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Corpo do Email</label>
              <textarea
                className="textarea" placeholder="Digite o conteúdo do seu email aqui..."
                value={body} onChange={(e) => setBody(e.target.value)}
                style={{ minHeight: '200px' }}
              />
              <div className="char-count">{body.length} caracteres</div>
            </div>
          </div>

          <button type="submit" className="button button-send">
            🚀 Enviar {emails => emails > 0 && `para ${emails} email(s)`}
            {recipientEmails.split(';').filter(e => e.trim()).length > 0 &&
              ` para ${recipientEmails.split(';').filter(e => e.trim()).length} email(s)`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendPage;
