import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from './Button';
import '../styles/Accounts.css';

interface Account {
  email: string;
  password: string;
  timestamp: string;
}

export const Accounts: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('premium-accounts', []);

  const formatAccount = (account: Account) => {
    const ts = account.timestamp;            // p.ej. "29/5/2025, 0:30:44"
  const [dateOnly] = ts.split(',');        // ["29/5/2025", " 0:30:44"]
  return `${dateOnly.trim()} ${account.email}:${account.password}`;
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(accounts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spotify_accounts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    const accountsText = accounts.map(formatAccount).join('\n');
    const dataBlob = new Blob([accountsText], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'spotify_accounts.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAccounts = () => {
    if (confirm('Are you sure you want to delete all saved accounts?')) {
      setAccounts([]);
    }
  };

  return (
    <div className="accounts-overlay">
      <div className="accounts-container">
        <div className="accounts-header">
          <h2>Premium Accounts ({accounts.length})</h2>
          <div className="accounts-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={handleExportJSON}
            >
              <Download size={14} />
              Export JSON
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={handleExportTXT}
            >
              <Download size={14} />
              Export TXT
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleClearAccounts}
            >
              <Trash2 size={14} />
              Clear All
            </Button>
            <button onClick={onClose} className="close-button">×</button>
          </div>
        </div>
        <div className="accounts-list">
          {accounts.length === 0 ? (
            <div className="no-accounts">No premium accounts found yet</div>
          ) : (
            accounts.map((account, index) => (
              <div key={index} className="account-item">
                <div className="account-text">
                  {formatAccount(account)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};