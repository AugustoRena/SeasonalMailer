import React, { useState, useEffect, useCallback } from 'react';

const TrackingPage = ({ onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/.netlify/functions/get-events');
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erro ao carregar dados');
        return;
      }
      const data = await res.json();
      setEvents(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (_err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    // Auto-refresh every 30s
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  // Group events by campaign
  const byCampaign = events.reduce((acc, ev) => {
    if (!acc[ev.campaign_id]) acc[ev.campaign_id] = [];
    acc[ev.campaign_id].push(ev);
    return acc;
  }, {});

  const campaigns = Object.entries(byCampaign).sort((a, b) => {
    const latestA = Math.max(...a[1].map(e => new Date(e.opened_at)));
    const latestB = Math.max(...b[1].map(e => new Date(e.opened_at)));
    return latestB - latestA;
  });

  const totalOpens = events.length;
  const uniqueCampaigns = campaigns.length;

  return (
    <div className="send-page">
      <div className="send-header">
        <div className="header-left">
          <h1>Rastreamento de Aberturas</h1>
        </div>
        <button className="button-logout" onClick={onLogout}>Sair</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <div style={numStyle('#2563eb')}>{totalOpens}</div>
          <div style={labelStyle}>Total de aberturas</div>
        </div>
        <div style={cardStyle}>
          <div style={numStyle('#059669')}>{uniqueCampaigns}</div>
          <div style={labelStyle}>Campanhas rastreadas</div>
        </div>
        <div style={{ ...cardStyle, gridColumn: 'span 1' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Atualizado</div>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            {lastUpdated ? lastUpdated.toLocaleTimeString('pt-BR') : '—'}
          </div>
          <button onClick={fetchEvents} style={refreshBtnStyle}>↻ Atualizar</button>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Carregando eventos...
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', color: '#b91c1c', marginBottom: '16px', fontSize: '13px' }}>
          ⚠️ {error}
          {error.includes('SUPABASE') && (
            <div style={{ marginTop: '8px', color: '#6b7280' }}>
              Configure <code>SUPABASE_URL</code> e <code>SUPABASE_SERVICE_KEY</code> nas variáveis de ambiente do Netlify.
            </div>
          )}
        </div>
      )}

      {!loading && !error && campaigns.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>Nenhuma abertura registrada ainda</div>
          <div style={{ fontSize: '13px' }}>As aberturas aparecerão aqui quando os destinatários abrirem os emails.</div>
        </div>
      )}

      {campaigns.map(([campaignId, openEvents]) => (
        <div key={campaignId} style={campaignCardStyle}>
          <div style={campaignHeaderStyle}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{campaignId}</div>
              <div style={{ fontSize: '13px', color: '#111827', marginTop: '2px' }}>
                {openEvents.length} abertura{openEvents.length !== 1 ? 's' : ''}
                <span style={{ color: '#9ca3af', marginLeft: '8px' }}>
                  · última: {new Date(openEvents[0].opened_at).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            <span style={badgeStyle}>{openEvents.length}</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Aberto em</th>
                  <th style={thStyle}>Cliente de email</th>
                </tr>
              </thead>
              <tbody>
                {openEvents.map((ev, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={tdStyle}>{ev.email}</td>
                    <td style={tdStyle}>{new Date(ev.opened_at).toLocaleString('pt-BR')}</td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: '11px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {parseUserAgent(ev.user_agent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <p style={{ fontSize: '11px', color: '#d1d5db', textAlign: 'center', marginTop: '24px' }}>
        ℹ️ Rastreamento por pixel — clientes como Apple Mail podem registrar aberturas automaticamente sem o usuário ter lido o email.
      </p>
    </div>
  );
};

const parseUserAgent = (ua) => {
  if (!ua) return '—';
  if (ua.includes('Googlebot') || ua.includes('Google Image')) return 'Gmail (pré-fetch)';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'Apple Mail / iOS';
  if (ua.includes('Macintosh') && ua.includes('AppleWebKit')) return 'Apple Mail / Mac';
  if (ua.includes('Outlook')) return 'Outlook';
  if (ua.includes('Thunderbird')) return 'Thunderbird';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  return ua.slice(0, 40) + (ua.length > 40 ? '…' : '');
};

const cardStyle = { background: '#f9fafb', borderRadius: '10px', padding: '14px 16px' };
const numStyle = (color) => ({ fontSize: '28px', fontWeight: '500', color });
const labelStyle = { fontSize: '12px', color: '#6b7280', marginTop: '2px' };
const refreshBtnStyle = { marginTop: '8px', fontSize: '11px', padding: '3px 8px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: 'pointer', color: '#374151' };
const campaignCardStyle = { background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '16px', marginBottom: '12px' };
const campaignHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' };
const badgeStyle = { background: '#eff6ff', color: '#1d4ed8', fontSize: '13px', fontWeight: '500', padding: '2px 10px', borderRadius: '999px' };
const thStyle = { textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: '500', fontSize: '12px' };
const tdStyle = { padding: '8px 12px', color: '#111827' };

export default TrackingPage;
