import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface Account {
  email: string;
  password: string;
  timestamp: string;
}

interface AccountStats {
  premium: number;
  declined: number;
  threeDSecure: number;
}

export function useAccountManager() {
  const [premiumAccounts, setPremiumAccounts] = useLocalStorage<Account[]>('premium-accounts', []);
  const [stats, setStats] = useState<AccountStats>({ premium: 0, declined: 0, threeDSecure: 0 });
  const [processedAccounts] = useState(new Set<string>());

  const processMessage = (msg: string) => {
    // Procesar cada línea por separado
    const lines = msg.split('\n');
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('premium')) {
        try {
          // Extraer la hora y los datos de la cuenta
          const parts = line.trim().split(' ');
          const timestamp = parts[0]; // Obtener el timestamp
          
          // Buscar la parte que contiene email:password
          const accountPart = parts.find(part => part.includes(':'));
          if (accountPart) {
            const [email, password] = accountPart.split(':');
            const accountKey = `${email}:${password}`;
            
            if (!processedAccounts.has(accountKey)) {
              processedAccounts.add(accountKey);
              
              setPremiumAccounts(prev => [
                ...prev,
                {
                  email,
                  password,
                  timestamp
                }
              ]);
              
              setStats(prev => ({ ...prev, premium: prev.premium + 1 }));
            }
          }
        } catch (error) {
          console.error('Error processing premium account:', error);
        }
      } else if (line.toLowerCase().includes('declined')) {
        setStats(prev => ({ ...prev, declined: prev.declined + 1 }));
      } else if (line.toLowerCase().includes('counter')) {
        setStats(prev => ({ ...prev, threeDSecure: prev.threeDSecure + 1 }));
      }
    });
  };

  const reset = () => {
    processedAccounts.clear();
    setStats({ premium: 0, declined: 0, threeDSecure: 0 });
  };

  return {
    premiumAccounts,
    stats,
    processMessage,
    reset
  };
}