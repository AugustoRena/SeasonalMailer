import React, { useState, useEffect } from 'react';

const ProgressPage = ({ totalEmails }) => {
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);
  const [failed, setFailed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simular progresso (já que o backend envia de forma async)
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next > totalEmails) {
          clearInterval(interval);
          return totalEmails;
        }
        
        // Simular sucesso/falha aleatória (90% sucesso)
        if (Math.random() < 0.9) {
          setSent(s => s + 1);
        } else {
          setFailed(f => f + 1);
        }
        
        setProgress((next / totalEmails) * 100);
        return next;
      });
    }, 10000); // A cada 10 segundos (delay dos emails)

    return () => clearInterval(interval);
  }, [totalEmails]);

  return (
    <div className="send-page">
      <div className="progress-card">
        <h2 className="progress-title">📤 Enviando Emails...</h2>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="progress-text">
          {currentIndex} de {totalEmails} emails processados
        </p>

        <div className="progress-details">
          <div className="detail-item">
            <span className="detail-label">Enviados com sucesso:</span>
            <span className="detail-value sent">✓ {sent}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Erros:</span>
            <span className="detail-value failed">✗ {failed}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Restantes:</span>
            <span className="detail-value">{totalEmails - currentIndex}</span>
          </div>
        </div>

        <div className="current-email">
          <div className="current-email-label">Email Atual</div>
          <div className="current-email-value">
            Processando... ({currentIndex + 1}/{totalEmails})
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
          ⏱️ Aguarde: enviando 1 email a cada 10 segundos
        </p>
      </div>
    </div>
  );
};

export default ProgressPage;
