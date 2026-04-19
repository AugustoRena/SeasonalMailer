import React from 'react';

const ProgressPage = ({ progressData, totalEmails }) => {
  const total = progressData?.total || totalEmails || 1;
  const current = progressData?.current || 0;
  const sent = progressData?.sent || 0;
  const failed = progressData?.failed || 0;
  const remaining = total - current;

  // Progress caps at 99% — 100% only when results screen appears
  const progress = current > 0 ? Math.min((current / total) * 100, 99) : 0;
  const estimatedSecondsLeft = remaining * 10;
  const minutes = Math.floor(estimatedSecondsLeft / 60);
  const seconds = estimatedSecondsLeft % 60;
  const timeLabel = current === 0
    ? 'Iniciando...'
    : remaining === 0
      ? 'Finalizando...'
      : minutes > 0
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
          {current} de {total} emails processados — {timeLabel}
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
            <span className="detail-value">{remaining}</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px', textAlign: 'center' }}>
          ⏱️ Progresso atualizado a cada 3 segundos diretamente do servidor.
        </p>
      </div>
    </div>
  );
};

export default ProgressPage;
