import React, { useState } from 'react';
import './App.css';
import SetupPage from './pages/SetupPage';
import SendPage from './pages/SendPage';
import TrackingPage from './pages/TrackingPage';

function App() {
  const [connected, setConnected] = useState(() => sessionStorage.getItem('smtp_verified') === 'true');
  const [tab, setTab] = useState('send');

  const handleSetupComplete = () => {
    sessionStorage.setItem('smtp_verified', 'true');
    setConnected(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smtp_verified');
    setConnected(false);
    setTab('send');
  };

  if (!connected) {
    return <div className="app"><SetupPage onSetupComplete={handleSetupComplete} /></div>;
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <button className={`nav-tab ${tab === 'send' ? 'active' : ''}`} onClick={() => setTab('send')}>
          ✉️ Enviar
        </button>
        <button className={`nav-tab ${tab === 'tracking' ? 'active' : ''}`} onClick={() => setTab('tracking')}>
          📊 Rastreamento
        </button>
      </nav>
      {tab === 'send'
        ? <SendPage onLogout={handleLogout} />
        : <TrackingPage onLogout={handleLogout} />}
    </div>
  );
}

export default App;
