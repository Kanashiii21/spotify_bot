import React, { useEffect, useRef } from 'react';
import { LucideTerminal } from 'lucide-react';
import '../styles/Terminal.css';

interface TerminalProps {
  output: string[];
  isProcessing: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ output, isProcessing }) => {
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <LucideTerminal size={16} />
        <span>CONSOLE OUTPUT</span>
        {isProcessing && <div className="terminal-loader"></div>}
      </div>
      
      <div 
        ref={consoleRef}
        className={`terminal-output ${isProcessing ? 'processing' : ''}`}
      >
        {output.length === 0 ? (
          <div className="terminal-placeholder">
            <span>Ready for operation...</span>
            <span className="blink">_</span>
          </div>
        ) : (
          output.map((line, index) => (
            <div 
              key={index} 
              className={`terminal-line ${line.includes('[ERROR]') ? 'error' : ''}`}
            >
              {line}
            </div>
          ))
        )}
        {isProcessing && (
          <div className="terminal-line processing">
            <span className="blink">_</span>
          </div>
        )}
      </div>
    </div>
  );
};