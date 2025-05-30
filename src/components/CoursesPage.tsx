import React from 'react';

interface CoursesPageProps {
  isNight: boolean;
  onClose: () => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ isNight, onClose }) => {
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
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Our Courses</h1>
      <p style={{ maxWidth: 600, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        Discover our unique courses designed to boost happiness, creativity, and well-being:
      </p>
      <ul style={{ fontSize: 17, marginBottom: 32, maxWidth: 500, color: isNight ? '#ffe259' : '#1976d2' }}>
        <li style={{ marginBottom: 10 }}><b>Happiness 101:</b> Foundations of joy and positive psychology</li>
        <li style={{ marginBottom: 10 }}><b>Creative Play:</b> Unlocking imagination through art and games</li>
        <li style={{ marginBottom: 10 }}><b>Mindful Living:</b> Mindfulness, gratitude, and daily well-being</li>
        <li style={{ marginBottom: 10 }}><b>Social Connection:</b> Building empathy and strong relationships</li>
        <li style={{ marginBottom: 10 }}><b>Resilience Training:</b> Bouncing back from setbacks with optimism</li>
      </ul>
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

export default CoursesPage;
