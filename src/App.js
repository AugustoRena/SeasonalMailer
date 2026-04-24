import React, { useState, useRef } from 'react';
import './App.css';
import SetupPage from './pages/SetupPage';
import SendPage from './pages/SendPage';
import TrackingPage from './pages/TrackingPage';

function App() {
  const [connected, setConnected] = useState(() => sessionStorage.getItem('smtp_verified') === 'true');
  const [tab, setTab] = useState('send');

  // Send state lives here so it survives tab switches
  const [sendPhase, setSendPhase] = useState('form'); // 'form' | 'progress' | 'results'
  const [progressData, setProgressData] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  // Abort flag — incrementing cancels any running send loop
  const abortRef = useRef(0);

  const handleSetupComplete = () => {
    sessionStorage.setItem('smtp_verified', 'true');
    setConnected(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smtp_verified');
    abortRef.current += 1; // cancel any running send
    setConnected(false);
    setTab('send');
    setSendPhase('form');
    setProgressData(null);
    setResultsData(null);
  };

  const handleResetSend = () => {
    abortRef.current += 1;
    setSendPhase('form');
    setProgressData(null);
    setResultsData(null);
  };

  const isSending = sendPhase === 'progress';

  if (!connected) {
    return <div className="app"><SetupPage onSetupComplete={handleSetupComplete} /></div>;
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <button className={`nav-tab ${tab === 'send' ? 'active' : ''}`} onClick={() => setTab('send')}>
          ✉️ Enviar
          {isSending && <span className="nav-badge">•</span>}
        </button>
        <button className={`nav-tab ${tab === 'tracking' ? 'active' : ''}`} onClick={() => setTab('tracking')}>
          📊 Rastreamento
        </button>
      </nav>

      {/* Always render SendPage — just hide it when on tracking tab */}
      <div style={{ display: tab === 'send' ? 'block' : 'none' }}>
        <SendPage
          onLogout={handleLogout}
          sendPhase={sendPhase}
          setSendPhase={setSendPhase}
          progressData={progressData}
          setProgressData={setProgressData}
          resultsData={resultsData}
          setResultsData={setResultsData}
          abortRef={abortRef}
          onResetSend={handleResetSend}
        />
      </div>

      {tab === 'tracking' && <TrackingPage onLogout={handleLogout} />}
    </div>
  );
}

export default App;
