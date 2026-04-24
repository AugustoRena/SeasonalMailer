import React, { useRef, useEffect } from 'react';

const statusConfig = {
  enviado: { label: '✓ Enviado',         color: '#059669', bg: '#ecfdf5' },
  erro:    { label: '✗ Erro',            color: '#dc2626', bg: '#fef2f2' },
  pulado:  { label: '⟳ Já enviado',     color: '#d97706', bg: '#fffbeb' },
};

const ProgressPage = ({ progressData, onCancel }) => {
  const logEndRef = useRef(null);
  const { phase, total, current, sent, failed, skipped, log } = progressData || {};

  const remaining = total - current;
  const progress = current > 0 ? Math.min(Math.round((current / total) * 100), 99) : 0;
  const pendingSends = (total - skipped) - sent - failed;
  const estSeconds = pendingSends * 20;
  const estMin = Math.floor(estSeconds / 60);
  const estSec = estSeconds % 60;
  const timeLabel = phase === 'checking'
    ? 'Verificando duplicatas...'
    : current === 0
      ? 'Iniciando...'
      : remaining === 0
        ? 'Finalizando...'
        : estMin > 0 ? `~${estMin}min ${estSec}s restantes` : `~${estSec}s restantes`;

  // Auto-scroll log to bottom as new entries arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="send-page">
      <div className="progress-card">
        <h2 className="progress-title">
          {phase === 'checking' ? '🔍 Verificando lista...' : '📤 Enviando Emails...'}
        </h2>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="progress-text">{current} de {total} processados — {timeLabel}</p>

        {/* Summary counters */}
        <div className="progress-details">
          <div className="detail-item">
            <span className="detail-label">✓ Enviados:</span>
            <span className="detail-value" style={{ color: '#059669', fontWeight: '600' }}>{sent || 0}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">✗ Erros:</span>
            <span className="detail-value" style={{ color: '#dc2626', fontWeight: '600' }}>{failed || 0}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">⟳ Pulados:</span>
            <span className="detail-value" style={{ color: '#d97706', fontWeight: '600' }}>{skipped || 0}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">⏳ Restantes:</span>
            <span className="detail-value">{remaining || 0}</span>
          </div>
        </div>

        {/* Live log */}
        {log && log.length > 0 && (
          <div style={{
            marginTop: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '8px 12px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              Log em tempo real
            </div>
            <div style={{
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '8px 0'
            }}>
              {log.map((entry, idx) => {
                const cfg = statusConfig[entry.status] || statusConfig.erro;
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '6px 12px',
                    borderBottom: idx < log.length - 1 ? '1px solid #f3f4f6' : 'none',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    {/* Status badge */}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: cfg.bg,
                      color: cfg.color,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minWidth: '90px',
                      textAlign: 'center'
                    }}>
                      {cfg.label}
                    </span>

                    {/* Email */}
                    <span style={{
                      fontSize: '13px',
                      color: '#111827',
                      fontFamily: 'monospace',
                      flexShrink: 0
                    }}>
                      {entry.email}
                    </span>

                    {/* Reason / error */}
                    {entry.reason && (
                      <span style={{
                        fontSize: '12px',
                        color: entry.status === 'erro' ? '#dc2626' : '#9ca3af',
                        marginLeft: 'auto',
                        textAlign: 'right',
                        flexShrink: 1
                      }}>
                        {entry.reason}
                      </span>
                    )}

                    {/* Timestamp */}
                    <span style={{
                      fontSize: '11px',
                      color: '#d1d5db',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      {new Date(entry.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', textAlign: 'center' }}>
          ⏱️ 1 email a cada 20 segundos · Mantenha esta aba aberta
        </p>

        {onCancel && (
          <button onClick={onCancel} style={{
            marginTop: '12px', display: 'block', width: '100%',
            padding: '8px', borderRadius: '8px',
            border: '1px solid #e5e7eb', background: 'white',
            color: '#6b7280', fontSize: '13px', cursor: 'pointer'
          }}>
            ✕ Cancelar envio
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ProgressPage;
