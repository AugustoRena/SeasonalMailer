import React, { useState } from 'react';

const ResultsPage = ({ resultsData, onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  if (!resultsData) return null;

  const { summary, results } = resultsData;
  const sent   = results.filter(r => r.status === 'enviado');
  const failed  = results.filter(r => r.status === 'erro');
  const skipped = results.filter(r => r.status === 'pulado');

  const tabs = [
    { key: 'all',    label: `Todos (${results.length})` },
    { key: 'enviado', label: `✓ Enviados (${sent.length})` },
    { key: 'erro',    label: `✗ Erros (${failed.length})` },
    { key: 'pulado',  label: `⟳ Pulados (${skipped.length})` },
  ].filter(t => t.key === 'all' || results.filter(r => r.status === t.key).length > 0);

  const visible = activeTab === 'all' ? results : results.filter(r => r.status === activeTab);

  const allGood = failed.length === 0;

  return (
    <div className="results-page">
      <div className="results-header">
        <h2 className="results-title">{allGood ? '✅ Campanha Concluída!' : '⚠️ Campanha Concluída com Erros'}</h2>

        {/* Summary cards */}
        <div className="results-stats">
          <div className="stat-box">
            <div className="stat-number">{summary.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box stat-sent">
            <div className="stat-number" style={{ color: '#059669' }}>{summary.sent}</div>
            <div className="stat-label">Enviados ✓</div>
          </div>
          {summary.skipped > 0 && (
            <div className="stat-box">
              <div className="stat-number" style={{ color: '#d97706' }}>{summary.skipped}</div>
              <div className="stat-label">Pulados ⟳</div>
            </div>
          )}
          {summary.failed > 0 && (
            <div className="stat-box stat-failed">
              <div className="stat-number" style={{ color: '#dc2626' }}>{summary.failed}</div>
              <div className="stat-label">Erros ✗</div>
            </div>
          )}
        </div>

        {/* Contextual tip */}
        {summary.skipped > 0 && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#92400e', marginTop: '12px' }}>
            ⟳ {summary.skipped} email(s) foram pulados pois já receberam nos últimos 30 dias.
          </div>
        )}
        {summary.failed > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#991b1b', marginTop: '8px' }}>
            ✗ {summary.failed} email(s) falharam. Verifique os motivos abaixo e tente reenviar manualmente se necessário.
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '5px 14px',
              borderRadius: '999px',
              border: '1px solid',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? '600' : '400',
              background: activeTab === tab.key ? '#111827' : 'white',
              color: activeTab === tab.key ? 'white' : '#374151',
              borderColor: activeTab === tab.key ? '#111827' : '#e5e7eb',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results table */}
      <div className="results-table">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Motivo / Detalhe</th>
                <th>Horário</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{r.email}</td>
                  <td>
                    {r.status === 'enviado' && <span className="status-badge enviado">✓ Enviado</span>}
                    {r.status === 'erro'    && <span className="status-badge erro">✗ Erro</span>}
                    {r.status === 'pulado'  && <span className="status-badge pulado">⟳ Pulado</span>}
                  </td>
                  <td style={{ fontSize: '12px', maxWidth: '280px' }}>
                    {r.status === 'enviado' && <span style={{ color: '#059669' }}>Email entregue com sucesso</span>}
                    {r.status === 'pulado'  && <span style={{ color: '#d97706' }}>{r.reason}</span>}
                    {r.status === 'erro'    && <span style={{ color: '#dc2626' }}>{r.reason || 'Erro desconhecido'}</span>}
                  </td>
                  <td className="timestamp" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(r.timestamp).toLocaleTimeString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="button button-back" onClick={onBack}>← Nova Campanha</button>
    </div>
  );
};

export default ResultsPage;
