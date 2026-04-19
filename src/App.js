import React, { useState } from 'react';
import './App.css';
import SetupPage from './pages/SetupPage';
import SendPage from './pages/SendPage';

function App() {
  const [credentials, setCredentials] = useState(null);

  const handleSetupComplete = (email, password) => {
    setCredentials({ email, password });
  };

  const handleLogout = () => {
    setCredentials(null);
  };

  return (
    <div className="app">
      {!credentials ? (
        <SetupPage onSetupComplete={handleSetupComplete} />
      ) : (
        <SendPage credentials={credentials} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
