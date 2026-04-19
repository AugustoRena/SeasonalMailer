import React, { useState } from 'react';

const SetupPage = ({ onSetupComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus({ type: 'error', message: 'Preenchaa o email e a senha' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'loading', message: 'Testando conexão...' });

    try {
      const response = await fetch('/.netlify/functions/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setTimeout(() => {
          onSetupComplete(email, password);
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
            Configure suas credenciais do Gmail para começar a enviar emails em massa
          </p>
        </div>

        {status && (
          <div className={`status-message status-${status.type}`}>
            {status.type === 'loading' && <span className="loading-spinner"></span>}
            {status.message}
          </div>
        )}

        <form onSubmit={handleTestConnection}>
          <div className="form-group">
            <label className="form-label">Email Gmail</label>
            <input
              type="email"
              className="form-input"
              placeholder="seu-email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha de App do Gmail</label>
            <input
              type="password"
              className="form-input"
              placeholder="Digite sua senha de app"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              marginTop: '8px',
              lineHeight: '1.4'
            }}>
              💡 Não tem uma senha de app? Vá para{' '}
              <a 
                href="https://myaccount.google.com/apppasswords" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none' }}
              >
                myaccount.google.com/apppasswords
              </a>
            </p>
          </div>

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
