import React, { useState } from 'react';
import './App.css';
import SetupPage from './pages/SetupPage';
import SendPage from './pages/SendPage';

function App() {
  // Persist connection status in sessionStorage so page refresh doesn't log user out
  const [connected, setConnected] = useState(() => {
    return sessionStorage.getItem('smtp_verified') === 'true';
  });

  const handleSetupComplete = () => {
    sessionStorage.setItem('smtp_verified', 'true');
    setConnected(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smtp_verified');
    setConnected(false);
  };

  return (
    <div className="app">
      {!connected ? (
        <SetupPage onSetupComplete={handleSetupComplete} />
      ) : (
        <SendPage onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
