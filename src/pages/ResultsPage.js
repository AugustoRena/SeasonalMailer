import React from 'react';

const ResultsPage = ({ resultsData, onBack }) => {
  if (!resultsData) {
    return null;
  }

  const { summary, results } = resultsData;

  return (
    <div className="results-page">
      <div className="results-header">
        <h2 className="results-title">✅ Campanha Concluída!</h2>
        <p className="results-message">{resultsData.message}</p>

        <div className="results-stats">
          <div className="stat-box">
            <div className="stat-number">{summary.total}</div>
            <div className="stat-label">Total de Emails</div>
          </div>
          <div className="stat-box stat-sent">
            <div className="stat-number">{summary.sent}</div>
            <div className="stat-label">Enviados ✓</div>
          </div>
          <div className="stat-box stat-failed">
            <div className="stat-number">{summary.failed}</div>
            <div className="stat-label">Com Erro ✗</div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="results-table">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Horário</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '500' }}>{result.email}</td>
                    <td>
                      <span className={`status-badge ${result.status}`}>
                        {result.status === 'enviado' ? '✓ Enviado' : '✗ Erro'}
                      </span>
                    </td>
                    <td>
                      <span className="timestamp">
                        {new Date(result.timestamp).toLocaleTimeString('pt-BR')}
                      </span>
                    </td>
                    <td>
                      {result.error ? (
                        <span style={{ color: '#ef4444', fontSize: '12px' }}>
                          {result.error}
                        </span>
                      ) : (
                        <span style={{ color: '#10b981', fontSize: '12px' }}>
                          Email entregue
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button className="button button-back" onClick={onBack}>
        ← Voltar para Envio
      </button>
    </div>
  );
};

export default ResultsPage;
