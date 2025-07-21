import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  isNight?: boolean;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, isNight = false, style }) => (
  <button
    onClick={onClick}
    aria-label="Back"
    style={{
      position: 'absolute',
      top: 16,
      left: 16,
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      zIndex: 10,
      ...style,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill={isNight ? '#232946' : '#51ff8b'} fillOpacity="0.9"/>
      <path d="M18.5 10L13 16L18.5 22" stroke={isNight ? '#ffe259' : '#232946'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </button>
);

export default BackButton;
