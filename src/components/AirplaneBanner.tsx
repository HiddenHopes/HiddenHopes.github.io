import React from 'react';
import { useTranslation } from 'react-i18next';

interface AirplaneBannerProps {
  onClick?: () => void;
  href?: string;
}

const AirplaneBanner: React.FC<AirplaneBannerProps> = ({ onClick, href }) => {
  const { t } = useTranslation();
  
  return (
    <div style={{
      position: 'fixed',
      top: 32,
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
        animation: 'plane-fly 20s linear infinite', // slowed down from 8s to 20s
      }}>
        {/* Airplane SVG */}
        <svg width="80" height="40" viewBox="0 0 80 40" style={{ position: 'absolute', right: 0, top: 20 }}>
          <g>
            <rect x="10" y="18" width="40" height="8" rx="4" fill="#1976d2" />
            <polygon points="50,22 75,20 50,26" fill="#1976d2" />
            <rect x="8" y="20" width="8" height="4" rx="2" fill="#51ff8b" />
            <circle cx="15" cy="28" r="2" fill="#232946" />
            <circle cx="45" cy="28" r="2" fill="#232946" />
          </g>
        </svg>
        {/* Flag/banner */}
        <a
          href={href}
          onClick={onClick}
          style={{
            position: 'absolute',
            right: 70,
            top: 10,
            height: 36,
            minWidth: 180,
            background: 'linear-gradient(90deg, #ffe259 0%, #51ff8b 100%)',
            color: '#232946',
            fontWeight: 700,
            fontSize: 20,
            borderRadius: '0 18px 18px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 36px',
            textDecoration: 'none',
            boxShadow: '0 2px 12px #51ff8b44',
            border: '2.5px solid #51ff8b',
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
          80% { transform: translateX(-300px); }
          100% { transform: translateX(-300px); }
        }
      `}</style>
    </div>
  );
};

export default AirplaneBanner;
