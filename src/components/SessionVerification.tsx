import React, { useState } from 'react';
import { Key, Loader } from 'lucide-react';
import { Button } from './Button';
import '../styles/SessionVerification.css';

interface SessionVerificationProps {
  onVerify: (key: string) => void;
}

export const SessionVerification: React.FC<SessionVerificationProps> = ({ onVerify }) => {
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API verification - replace with actual verification
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any key that's 16 characters long
      if (key.length !== 16) {
        throw new Error('Invalid key format');
      }

      onVerify(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="session-verification-overlay">
      <div className="session-verification-card">
        <div className="verification-icon">
          <Key size={32} />
        </div>
        
        <h2>Session Verification Required</h2>
        <p>Please enter your verification key to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your 16-character key"
              maxLength={16}
              disabled={isLoading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || key.length === 0}
          >
            {isLoading ? (
              <>
                <Loader className="spin\" size={16} />
                Verifying...
              </>
            ) : (
              'Verify Session'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};