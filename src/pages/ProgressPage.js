import React, { useState, useEffect } from 'react';

const ProgressPage = ({ totalEmails }) => {
  const [elapsed, setElapsed] = useState(0);
  const estimatedSeconds = totalEmails * 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= estimatedSeconds) {
          clearInterval(interval);
          return estimatedSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [estimatedSeconds]);

  const progress = Math.min((elapsed / estimatedSeconds) * 100, 99); // Never show 100% — real result comes from backend
  const remaining = Math.max(estimatedSeconds - elapsed, 0);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeLabel = minutes > 0
    ? `~${minutes}min ${seconds}s restantes`
    : `~${seconds}s restantes`;

  return (
    <div className="send-page">
      <div className="progress-card">
        <h2 className="progress-title">📤 Enviando Emails...</h2>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="progress-text">
          {elapsed < estimatedSeconds
            ? timeLabel
            : 'Aguardando resposta do servidor...'}
        </p>

        <div className="progress-details">
          <div className="detail-item">
            <span className="detail-label">Total de destinatários:</span>
            <span className="detail-value">{totalEmails}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tempo estimado:</span>
            <span className="detail-value">{Math.ceil(estimatedSeconds / 60)} min</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px', textAlign: 'center' }}>
          ⏱️ O servidor está enviando 1 email a cada 10 segundos.<br />
          Os resultados reais serão exibidos ao final.
        </p>
      </div>
    </div>
  );
};

export default ProgressPage;
