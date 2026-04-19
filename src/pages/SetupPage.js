import React, { useState } from 'react';

const SetupPage = ({ onSetupComplete }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: 'loading', message: 'Testando conexão...' });

    try {
      const response = await fetch('/.netlify/functions/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Credentials are now stored in Netlify env vars — nothing sensitive sent from client
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setTimeout(() => {
          onSetupComplete();
        }, 1000);
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao conectar. Verifique sua internet.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-header">
          <span className="setup-icon">📧</span>
          <h1 className="setup-title">Configuração de Email</h1>
          <p className="setup-subtitle">
            As credenciais do Gmail são configuradas via variáveis de ambiente no Netlify.
            Clique em "Testar Conexão" para verificar se estão corretas.
          </p>
        </div>

        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#0369a1',
          lineHeight: '1.6'
        }}>
          <strong>Como configurar:</strong><br />
          No painel do Netlify → Site settings → Environment variables, adicione:<br />
          <code>GMAIL_USER</code> = seu-email@gmail.com<br />
          <code>GMAIL_APP_PASSWORD</code> = sua senha de app
        </div>

        {status && (
          <div className={`status-message status-${status.type}`}>
            {status.type === 'loading' && <span className="loading-spinner"></span>}
            {status.message}
          </div>
        )}

        <form onSubmit={handleTestConnection}>
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Testando...' : 'Testar Conexão'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;
