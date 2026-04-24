import React, { useState } from 'react';
import ProgressPage from './ProgressPage';
import ResultsPage from './ResultsPage';

const MAX_PDF_BYTES = 4 * 1024 * 1024;
const BATCH_SIZE = 1;
const DELAY_MS = 20000;

const SendPage = ({
  onLogout,
  sendPhase, setSendPhase,
  progressData, setProgressData,
  resultsData, setResultsData,
  abortRef, onResetSend
}) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { alert('Por favor, selecione um arquivo PDF válido'); return; }
    if (file.size > MAX_PDF_BYTES) {
      alert(`Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Limite: 4 MB.`);
      e.target.value = '';
      return;
    }
    setPdfFile(file);
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();

    if (!pdfFile || !recipientEmails || !subject || !body) { alert('Preencha todos os campos obrigatórios'); return; }

    const emails = recipientEmails.split(';').map(em => em.trim()).filter(em => em.length > 0);
    if (emails.length === 0) { alert('Adicione pelo menos um email'); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.filter(em => !emailRegex.test(em));
    if (invalid.length > 0) { alert(`Emails inválidos: ${invalid.join(', ')}`); return; }

    // Cancel any previous send loop and start a new generation
    abortRef.current += 1;
    const myGeneration = abortRef.current;

    const isAborted = () => abortRef.current !== myGeneration;

    const campaignId = `camp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const siteUrl = window.location.origin;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];

      setSendPhase('progress');
      setProgressData({ phase: 'checking', total: emails.length, current: 0, sent: 0, failed: 0, skipped: 0, log: [] });

      // ── Step 1: Duplicate check ──
      let emailsToSend = emails;
      let initialLog = [];

      try {
        const dupRes = await fetch('/.netlify/functions/check-duplicates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emails })
        });
        if (dupRes.ok) {
          const { duplicates } = await dupRes.json();
          if (duplicates.length > 0) {
            emailsToSend = emails.filter(em => !duplicates.includes(em));
            initialLog = duplicates.map(email => ({
              email, status: 'pulado',
              reason: 'Email já recebeu nos últimos 30 dias',
              timestamp: new Date().toISOString()
            }));
          }
        }
      } catch (_err) { /* proceed with all */ }

      if (isAborted()) return;

      const total = emails.length;
      const allResults = [...initialLog];

      setProgressData({
        phase: 'sending', total,
        current: initialLog.length, sent: 0,
        failed: 0, skipped: initialLog.length,
        log: [...initialLog]
      });

      // ── Step 2: Send ──
      for (let i = 0; i < emailsToSend.length; i += BATCH_SIZE) {
        if (isAborted()) return; // stop if user started new send or logged out

        const batch = emailsToSend.slice(i, i + BATCH_SIZE);
        const ts = new Date().toISOString();

        try {
          const response = await fetch('/.netlify/functions/send-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ batch, subject, body, attachmentBase64: base64, attachmentFilename: pdfFile.name, campaignId, siteUrl })
          });

          if (isAborted()) return;

          const data = await response.json();

          if (!response.ok) {
            batch.forEach(email => allResults.push({ email, status: 'erro', reason: data.error || 'Erro desconhecido', timestamp: ts }));
          } else {
            data.results.forEach(r => allResults.push({ email: r.email, status: r.status, reason: r.error || null, timestamp: r.timestamp }));
          }
        } catch (_err) {
          if (isAborted()) return;
          batch.forEach(email => allResults.push({ email, status: 'erro', reason: 'Falha de conexão com o servidor', timestamp: ts }));
        }

        const sent    = allResults.filter(r => r.status === 'enviado').length;
        const failed  = allResults.filter(r => r.status === 'erro').length;
        const skipped = allResults.filter(r => r.status === 'pulado').length;

        setProgressData({ phase: 'sending', total, current: skipped + sent + failed, sent, failed, skipped, log: [...allResults] });

        if (i + BATCH_SIZE < emailsToSend.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          if (isAborted()) return;
        }
      }

      if (isAborted()) return;

      const finalSent    = allResults.filter(r => r.status === 'enviado').length;
      const finalFailed  = allResults.filter(r => r.status === 'erro').length;
      const finalSkipped = allResults.filter(r => r.status === 'pulado').length;

      setResultsData({ summary: { total, sent: finalSent, failed: finalFailed, skipped: finalSkipped }, results: allResults });
      setSendPhase('results');
    };

    reader.readAsDataURL(pdfFile);
  };

  // ── Render ──

  if (sendPhase === 'progress') {
    return (
      <ProgressPage
        progressData={progressData}
        onCancel={() => {
          if (window.confirm('Cancelar o envio em andamento?')) {
            onResetSend();
          }
        }}
      />
    );
  }

  if (sendPhase === 'results') {
    return (
      <ResultsPage
        resultsData={resultsData}
        onBack={() => {
          onResetSend();
          setPdfFile(null);
          setRecipientEmails('');
          setSubject('');
          setBody('');
        }}
      />
    );
  }

  const emailCount = recipientEmails.split(';').filter(em => em.trim()).length;

  return (
    <div className="send-page">
      <div className="send-header">
        <div className="header-left"><h1>Enviar Emails em Massa</h1></div>
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
              <textarea className="textarea"
                placeholder="email1@example.com; email2@example.com; email3@example.com"
                value={recipientEmails} onChange={(e) => setRecipientEmails(e.target.value)}
              />
              <div className="char-count">{emailCount} email(s)</div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">✉️ Conteúdo do Email</div>
            <div className="form-grid">
              <div>
                <label className="form-label">Assunto</label>
                <input type="text" className="form-input"
                  placeholder="Ex: Candidatura - Vaga de Desenvolvedor"
                  value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={100}
                />
                <div className="char-count">{subject.length}/100</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Corpo do Email</label>
              <textarea className="textarea" placeholder="Digite o conteúdo do seu email aqui..."
                value={body} onChange={(e) => setBody(e.target.value)} style={{ minHeight: '200px' }}
              />
              <div className="char-count">{body.length} caracteres</div>
            </div>
          </div>

          <button type="submit" className="button button-send">
            🚀 {emailCount > 0 ? `Enviar para ${emailCount} email(s)` : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendPage;
