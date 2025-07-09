import React from 'react';

const Spinner: React.FC = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    background: 'rgba(0,0,0,0.08)',
    pointerEvents: 'none',
  }}>
    <div style={{
      width: 64,
      height: 64,
      border: '6px solid #51ff8b44',
      borderTop: '6px solid #51ff8b',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      boxShadow: '0 0 24px #51ff8b88',
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner;
