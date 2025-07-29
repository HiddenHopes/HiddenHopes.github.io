import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AirplaneIcon } from '../assets/airplane.svg';
interface AirplaneBannerProps {
  onClick?: () => void;
  href?: string;
}

const AirplaneBanner: React.FC<AirplaneBannerProps> = ({ onClick, href }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 0,
      width: '100vw',
      zIndex: 1200,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        width: '100vw',
        height: 80,
        overflow: 'visible',
        animation: 'plane-fly 20s linear infinite', // slowed down from 8s to 15s
      }}>
        {/* Airplane SVG */}
        <AirplaneIcon style={{ position: 'absolute', right: 305, top: 5 }} />
        {/* Flag/banner */}
        <a
          href={href}
          onClick={onClick}
          style={{
            position: 'absolute',
            right: 70,
            top: 30,
            height: 30,
            minWidth: 100,
            background: 'linear-gradient(90deg, #ffe259 0%, #51ff8b 100%)',
            color: '#232946',
            fontWeight: 700,
            fontSize: 18,
            borderRadius: '30px 18px 18px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 20px',
            textDecoration: 'none',
            boxShadow: '0 2px 12px #51ff8b44',
            border: '2px solid #3ea3601e',
            pointerEvents: 'auto',
            transition: 'background 0.3s',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          tabIndex={0}
          aria-label={t('aria_labels.register_course')}
        >
          🚩 Register for Course
        </a>
      </div>
      <style>{`
        @keyframes plane-fly {
          0% { transform: translateX(100vw); }
          10% { transform: translateX(30px); }
          90% { transform: translateX(-30px); }
          100% { transform: translateX(-2000px); }
        }
      `}</style>
    </div>
  );
};

export default AirplaneBanner;
