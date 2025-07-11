import React from 'react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  isNight: boolean
}

const Footer: React.FC<FooterProps> = ({ isNight }) => {
  const { t } = useTranslation();
  
  return (
  <footer
    style={{
      width: '100%',
      background: isNight
        ? 'linear-gradient(90deg,rgb(28, 89, 158) 0%,rgb(1, 3, 37) 100%)'
        : 'linear-gradient(90deg,rgb(247, 248, 248) 0%,rgb(140, 203, 245) 100%)',
      color: isNight ? '#fff' : '#232946',
      textAlign: 'center',
      padding: '1.2rem 0 1.5rem 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 10,
      fontSize: '1.05rem',
      boxShadow: isNight
        ? '0 -2px 8px rgba(0,0,0,0.15)'
        : '0 -2px 8px rgba(0,0,0,0.05)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      letterSpacing: '0.03em',
      transition: 'background 0.5s, color 0.5s, box-shadow 0.5s'
    }}
  >
    <div>
      &copy; {new Date().getFullYear()} <b>{t('footer.school_name')}</b>. {t('footer.rights_reserved')}
    </div>
    <div style={{ marginTop: 4 }}>
      <a
        href="https://hiddenhopes.github.io/"
        style={{
          color: isNight ? '#ffe259' : '#1976d2',
          margin: '0 0.5rem',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color 0.3s'
        }}
      >
        Live Demo
      </a>
      |
      <a
        href="https://github.com/hiddenhopes/school-of-happiness"
        style={{
          color: isNight ? '#ffe259' : '#1976d2',
          margin: '0 0.5rem',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color 0.3s'
        }}
      >
        GitHub
      </a>
    </div>
    <div style={{ marginTop: 4 }}>
      Contact:{' '}
      <a
        href="mailto:info@schoolofhappiness.com"
        style={{
          color: isNight ? '#ffe259' : '#1976d2',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color 0.3s'
        }}
      >
        info@schoolofhappiness.com
      </a>
    </div>
  </footer>
  );
};

export default Footer