import React from 'react';
import { Settings2, Save, Moon, Sun, Users } from 'lucide-react';
import { Switch } from './Switch';
import '../styles/TopNav.css';

interface TopNavProps {
  onToggleSettings: () => void;
  onToggleAccounts: () => void;
  saveBin: boolean;
  onToggleSaveBin: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  accountsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  onToggleSettings, 
  onToggleAccounts,
  saveBin, 
  onToggleSaveBin,
  theme,
  setTheme,
  accountsCount
}) => {
  const toggleTheme = () => {
    if (theme === 'cyberpunk-green') {
      setTheme('cyberpunk-blue');
    } else if (theme === 'cyberpunk-blue') {
      setTheme('cyberpunk-purple');
    } else {
      setTheme('cyberpunk-green');
    }
  };

  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <span className="logo">SPOTIFY</span>
        <span className="logo-accent">BOT</span>
      </div>
      
      <div className="nav-items">
        <div className="nav-item accounts" onClick={onToggleAccounts}>
          <Users size={16} />
          <span>Accounts ({accountsCount})</span>
        </div>

        <div className="nav-item">
          <Save size={16} />
          <span>Guardar BIN</span>
          <Switch 
            checked={saveBin}
            onChange={onToggleSaveBin}
          />
        </div>
        
        <div className="nav-item" onClick={toggleTheme}>
          {theme.includes('green') ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
          <span>Theme</span>
        </div>
        
        <div className="nav-item settings" onClick={onToggleSettings}>
          <Settings2 size={16} />
          <span>Settings</span>
        </div>
      </div>
    </nav>
  );
};