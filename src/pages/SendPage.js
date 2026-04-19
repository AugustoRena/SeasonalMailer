import React, { useState } from 'react';
import ProgressPage from './ProgressPage';
import ResultsPage from './ResultsPage';

const SendPage = ({ credentials, onLogout }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [recipientEmails, setRecipientEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [currentPage, setCurrentPage] = useState('form');
  const [progressData, setProgressData] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecione um arquivo PDF válido');
    }
  };

  const handleSendEmails = async (e) => {
    e.preventDefault();

    if (!pdfFile || !recipientEmails || !subject || !body) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar emails
    const emails = recipientEmails
      .split(';')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (emails.length === 0) {
      alert('Adicione pelo menos um email');
      return;
    }

    // Validar formato de emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      alert(`Emails inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Converter PDF para Base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];

      setCurrentPage('progress');
      setProgressData({
        total: emails.length,
        current: 0,
        sent: 0,
        failed: 0,
        currentEmail: emails[0]
      });

      try {
        const response = await fetch('/.netlify/functions/send-emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            recipients: recipientEmails,
            subject: subject,
            body: body,
            attachmentBase64: base64,
            attachmentFilename: pdfFile.name
          })
        });

        const data = await response.json();

        if (response.ok) {
          setResultsData({
            success: true,
            message: data.message,
            summary: data.summary,
            results: data.results
          });
          setCurrentPage('results');
        } else {
          alert('Erro ao enviar emails: ' + data.error);
          setCurrentPage('form');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
        setCurrentPage('form');
      }
    };

    reader.readAsDataURL(pdfFile);
  };

  if (currentPage === 'progress') {
    return (
      <ProgressPage 
        progressData={progressData} 
        totalEmails={recipientEmails.split(';').filter(e => e.trim()).length}
      />
    );
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
          <p>Configurado: {credentials.email}</p>
        </div>
        <button className="button-logout" onClick={onLogout}>
          Sair
        </button>
      </div>

      <div className="send-card">
        <form onSubmit={handleSendEmails}>
          {/* Seção do PDF */}
          <div className="form-section">
            <div className="section-title">📎 Anexar Currículo (PDF)</div>
            <div className="file-upload">
              <input
                type="file"
                id="pdf-input"
                className="file-input"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="pdf-input" className="file-upload-label">
                <span className="file-upload-icon">📄</span>
                <span className="file-upload-text">
                  Clique para selecionar seu PDF
                </span>
                {pdfFile && (
                  <span className="file-name">✓ {pdfFile.name}</span>
                )}
              </label>
            </div>
          </div>

          {/* Seção de Destinatários */}
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

          {/* Seção do Email */}
          <div className="form-section">
            <div className="section-title">✉️ Conteúdo do Email</div>

            <div className="form-grid">
              <div>
                <label className="form-label">Assunto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Candidatura - Vaga de Desenvolvedor"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={100}
                />
                <div className="char-count">{subject.length}/100</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Corpo do Email</label>
              <textarea
                className="textarea"
                placeholder="Digite o conteúdo do seu email aqui..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ minHeight: '200px' }}
              />
              <div className="char-count">{body.length} caracteres</div>
            </div>
          </div>

          <button type="submit" className="button button-send">
            🚀 Enviar {recipientEmails.split(';').filter(e => e.trim()).length > 0 && 
              `para ${recipientEmails.split(';').filter(e => e.trim()).length} email(s)`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendPage;
