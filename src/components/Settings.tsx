import React from 'react';
import { X, Save, AlertTriangle, RefreshCw, Key, Flame } from 'lucide-react';
import { Button } from './Button';
import { Switch } from './Switch';
import '../styles/Settings.css';

interface SettingsProps {
  onClose: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  saveBin: boolean;
  setSaveBin: (save: boolean) => void;
  onClearSession: () => void;
  hasSession: boolean;
}

export const Settings: React.FC<SettingsProps> = ({
  onClose,
  theme,
  setTheme,
  saveBin,
  setSaveBin,
  onClearSession,
  hasSession
}) => {
  const clearStoredData = () => {
    if (confirm('Are you sure you want to clear all stored data?')) {
      localStorage.clear();
      setSaveBin(false);
      alert('All stored data has been cleared.');
    }
  };

  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear your session? You will need to verify again.')) {
      onClearSession();
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3>Apariencia</h3>
            
            <div className="theme-options">
              <div 
                className={`theme-option ${theme === 'cyberpunk-green' ? 'active' : ''}`}
                onClick={() => setTheme('cyberpunk-green')}
              >
                <div className="color-preview green"></div>
                <span>Verde</span>
              </div>
              
              <div 
                className={`theme-option ${theme === 'cyberpunk-blue' ? 'active' : ''}`}
                onClick={() => setTheme('cyberpunk-blue')}
              >
                <div className="color-preview blue"></div>
                <span>Azul</span>
              </div>
              
              <div 
                className={`theme-option ${theme === 'cyberpunk-purple' ? 'active' : ''}`}
                onClick={() => setTheme('cyberpunk-purple')}
              >
                <div className="color-preview purple"></div>
                <span>Morado</span>
              </div>

              <div 
                className={`theme-option ${theme === 'cyberpunk-hellfire' ? 'active' : ''}`}
                onClick={() => setTheme('cyberpunk-hellfire')}
              >
                <div className="color-preview hellfire">
                  <Flame size={16} />
                </div>
                <span>Hellfire</span>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Securidad</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <Key size={16} />
                <span>Session Status</span>
              </div>
              <span className={`session-status ${hasSession ? 'active' : ''}`}>
                {hasSession ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            
            {hasSession && (
              <Button 
                variant="danger" 
                size="small"
                onClick={handleClearSession}
              >
                Limpiar Session
              </Button>
            )}
          </div>
          
          <div className="settings-section">
            <h3>Data Storage</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <Save size={16} />
                <span>Guardar BIN data</span>
              </div>
              <Switch 
                checked={saveBin}
                onChange={() => setSaveBin(!saveBin)}
              />
            </div>
            
            <div className="setting-warning">
              <AlertTriangle size={16} />
              <p>Eliminar Los Datos Eliminara El Estado Del Bin Actual.</p>
            </div>
            
            <Button 
              variant="danger" 
              size="small"
              onClick={clearStoredData}
            >
              <RefreshCw size={14} />
              Limpiar Stored Data
            </Button>
          </div>
          
          <div className="settings-section">
            <h3>About</h3>
            <p>Spotify_Bot v1.0.0</p>
            <p>© 2025 By Kanashii</p>
          </div>
        </div>
      </div>
    </div>
  );
};