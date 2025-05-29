import React from 'react';
import '../styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`cyber-button ${variant} ${size} ${loading ? 'loading' : ''}`}
    >
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <span className="button-text">{children}</span>
          <span className="button-glitch"></span>
        </>
      )}
    </button>
  );
};