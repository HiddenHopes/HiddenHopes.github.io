import React from 'react';

import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';

interface ContactPageProps {
  isNight: boolean;
  onClose: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ isNight, onClose }) => {
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
      top: 0,
      left: 0,
      display: 'flex',
      boxSizing: 'border-box',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      zIndex: 1000
    }}>
      <BackButton onClick={onClose} isNight={isNight} />
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>{t('contact.title')}</h1>
      <p style={{ maxWidth: 500, fontSize: 18, marginBottom: 32, textAlign: 'center' }}>
        {t('contact.description')} <a href="mailto:schoolofhappiness2024@gmail.com" style={{ color: isNight ? '#ffe259' : '#1976d2', textDecoration: 'underline' }}>schoolofhappiness2024@gmail.com</a>.
      </p>
      <div style={{ fontSize: 20, marginBottom: 16, textAlign: 'center', lineHeight: 1.7 }}>
        <div>🏠 {t('contact.address')}</div>
        <div>✆ {t('contact.phone')}</div>
      </div>
    </div>
  );
};

export default ContactPage;
