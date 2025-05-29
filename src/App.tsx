import React, { useState, useEffect } from 'react';
import { Terminal } from './components/Terminal';
import { BotForm } from './components/BotForm';
import { TopNav } from './components/TopNav';
import { Settings } from './components/Settings';
import { Accounts } from './components/Accounts';
import { SessionVerification } from './components/SessionVerification';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles/App.css';

interface Account {
  email: string;
  password: string;
  timestamp: string;
}

declare global {
  interface Window {
    electronAPI?: {
      startBot: (data: any) => void;
      stopBot: () => void;
      onStdout: (cb: (msg: string) => void) => void;
      onStderr: (cb: (msg: string) => void) => void;
    };
  }
}

function App() {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [saveBin, setSaveBin] = useLocalStorage('saveBin', false);
  const [savedBinData, setSavedBinData] = useLocalStorage('savedBinData', null);
  const [premiumAccounts, setPremiumAccounts] = useLocalStorage<Account[]>('premium-accounts', []);
  const [theme, setTheme] = useLocalStorage('theme', 'cyberpunk-green');
  const [stats, setStats] = useState({ premium: 0, declined: 0, threeDSecure: 0 });
  const [sessionKey, setSessionKey] = useLocalStorage('sessionKey', '');
  const [seenMessages] = useState(new Set<string>());

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onStdout((msg: string) => {
        if (!seenMessages.has(msg)) {
          seenMessages.add(msg);
          setConsoleOutput(prev => [...prev, msg]);
          
          // Handle multiple accounts in a single message
          if (msg.toLowerCase().includes('premium')) {
            const timestamp = msg.split(' ')[0];
            const accountPart = msg.split(' ').find(part => part.includes(':'));
            
            if (accountPart) {
              const [email, password] = accountPart.split(':');
              
              setPremiumAccounts(prev => {
                const accountExists = prev.some(acc => acc.email === email && acc.password === password);
                if (!accountExists) {
                  return [...prev, { email, password, timestamp }];
                }
                return prev;
              });
              
              setStats(prev => ({ ...prev, premium: prev.premium + 1 }));
            }
          } else if (msg.toLowerCase().includes('declined')) {
            setStats(prev => ({ ...prev, declined: prev.declined + 1 }));
          } else if (msg.toLowerCase().includes('counter')) {
            setStats(prev => ({ ...prev, threeDSecure: prev.threeDSecure + 1 }));
          }
          
          if (msg.includes('exited with code')) {
            setIsProcessing(false);
          }
        }
      });

      window.electronAPI.onStderr((err: string) => {
        const errorMsg = `[ERROR] ${err}`;
        if (!seenMessages.has(errorMsg)) {
          seenMessages.add(errorMsg);
          setConsoleOutput(prev => [...prev, errorMsg]);
          setIsProcessing(false);
        }
      });
    }
  }, []);

  const handleStartBot = (formData: any) => {
    if (isProcessing) return;
    
    setConsoleOutput([]);
    seenMessages.clear();
    setIsProcessing(true);
    setStats({ premium: 0, declined: 0, threeDSecure: 0 });
    
    if (saveBin) {
      setSavedBinData(formData);
    }

    if (window.electronAPI) {
      window.electronAPI.startBot(formData);
    } else {
      setConsoleOutput(['Error: Electron API not available']);
      setIsProcessing(false);
    }
  };

  const handleStopBot = () => {
    if (window.electronAPI) {
      window.electronAPI.stopBot();
      const stopMsg = 'Stopping bot...';
      if (!seenMessages.has(stopMsg)) {
        seenMessages.add(stopMsg);
        setConsoleOutput(prev => [...prev, stopMsg]);
      }
    }
  };

  const handleVerifySession = (key: string) => {
    setSessionKey(key);
  };

  const handleClearSession = () => {
    setSessionKey('');
  };

  const appContent = (
    <div className={`app-container ${theme}`}>
      <div className="scanlines"></div>
      <TopNav 
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleAccounts={() => setShowAccounts(!showAccounts)}
        saveBin={saveBin} 
        onToggleSaveBin={() => setSaveBin(!saveBin)}
        theme={theme}
        setTheme={setTheme}
        accountsCount={premiumAccounts.length}
      />
      <main className="main-area">
        <BotForm 
          onSubmit={handleStartBot}
          onStop={handleStopBot}
          savedData={savedBinData}
          isProcessing={isProcessing}
          stats={stats}
        />
        <Terminal 
          output={consoleOutput}
          isProcessing={isProcessing} 
        />
      </main>
      {showSettings && (
        <Settings 
          onClose={() => setShowSettings(false)}
          theme={theme}
          setTheme={setTheme}
          saveBin={saveBin}
          setSaveBin={setSaveBin}
          onClearSession={handleClearSession}
          hasSession={!!sessionKey}
        />
      )}
      {showAccounts && (
        <Accounts onClose={() => setShowAccounts(false)} />
      )}
    </div>
  );

  if (!sessionKey) {
    return (
      <div className={`app-container ${theme}`}>
        <div className="scanlines"></div>
        {appContent}
        <SessionVerification onVerify={handleVerifySession} />
      </div>
    );
  }

  return appContent;
}

export default App;