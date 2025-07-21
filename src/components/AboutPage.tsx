import React from 'react';

import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';

interface AboutPageProps {
  isNight: boolean;
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ isNight, onClose }) => {
  const { t } = useTranslation();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: isNight
        ? 'radial-gradient(ellipse at 50% 80%,rgb(24, 55, 133) 0%, #090a0f 100%)'
        : 'linear-gradient(to bottom, #e3f6ff 0%, #b3e0ff 100%)',
      color: isNight ? '#fff' : '#232946',
      position: 'absolute',
      boxSizing: 'border-box',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      zIndex: 1000
    }}>
      <BackButton onClick={onClose} isNight={isNight} />
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>{t('about.title')}</h1>
      <p style={{ maxWidth: 500, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        {t('about.description')}
      </p>
    </div>
  );
};

export default AboutPage;
