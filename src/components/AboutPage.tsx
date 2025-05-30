import React from 'react';

interface AboutPageProps {
  isNight: boolean;
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ isNight, onClose }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: isNight
        ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
        : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)',
      color: isNight ? '#fff' : '#232946',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>About School of Happiness</h1>
      <p style={{ maxWidth: 500, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        Welcome to the School of Happiness! This project is a playful, interactive web app designed to bring joy, learning, and creativity together. Explore games, weather updates, and more—all in a beautiful, immersive environment.
      </p>
      <button
        onClick={onClose}
        style={{
          padding: '10px 28px',
          fontSize: 18,
          borderRadius: 8,
          border: 'none',
          background: isNight ? '#232946' : '#51ff8b',
          color: isNight ? '#ffe259' : '#232946',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isNight ? '0 2px 8px #23294688' : '0 2px 8px #b3e0ff88'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default AboutPage;
