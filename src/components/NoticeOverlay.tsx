import React from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabaseClient';

type NoticeRow = {
  id: string | number;
  description: string;
  status?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
};

interface NoticeOverlayProps {
  isNight: boolean;
}

const DISMISSED_NOTICE_KEY = 'noticeOverlayDismissedNoticeId';

const NoticeOverlay: React.FC<NoticeOverlayProps> = ({ isNight }) => {
  const { t } = useTranslation();
  const [notice, setNotice] = React.useState<NoticeRow | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [dismissed, setDismissed] = React.useState(false);

  const fetchPublishedNotice = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('notice')
      .select('*')
      .eq('status', 'publish')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      const nextNotice = data as NoticeRow;
      const dismissedNoticeId = sessionStorage.getItem(DISMISSED_NOTICE_KEY);

      setNotice(nextNotice);
      setDismissed(String(nextNotice.id) === dismissedNoticeId);
    } else if (!data) {
      setNotice(null);
      sessionStorage.removeItem(DISMISSED_NOTICE_KEY);
      setDismissed(false);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    void fetchPublishedNotice();

    const channel = supabase
      .channel('notice-table-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notice' }, () => {
        void fetchPublishedNotice();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchPublishedNotice]);

  const handleClose = () => {
    if (notice?.id !== undefined && notice?.id !== null) {
      sessionStorage.setItem(DISMISSED_NOTICE_KEY, String(notice.id));
    }
    setDismissed(true);
  };

  if (loading || dismissed || !notice?.description) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: isNight
          ? 'radial-gradient(circle at top, rgba(81,255,139,0.18), rgba(6,10,18,0.82))'
          : 'radial-gradient(circle at top, rgba(25,118,210,0.14), rgba(255,255,255,0.76))',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(820px, 100%)',
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: 30,
          padding: '28px 26px 26px',
          boxShadow: isNight
            ? '0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)'
            : '0 30px 90px rgba(25,118,210,0.18), inset 0 1px 0 rgba(255,255,255,0.85)',
          border: isNight ? '1px solid rgba(81,255,139,0.20)' : '1px solid rgba(25,118,210,0.16)',
          background: isNight
            ? 'linear-gradient(160deg, rgba(11,16,28,0.94), rgba(30,38,62,0.90))'
            : 'linear-gradient(160deg, rgba(255,255,255,0.94), rgba(231,244,255,0.90))',
          color: isNight ? '#fff' : '#232946',
          transform: 'translateY(0)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 30, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -120, right: -80, width: 260, height: 260, borderRadius: '50%', background: isNight ? 'radial-gradient(circle, rgba(81,255,139,0.18), transparent 70%)' : 'radial-gradient(circle, rgba(25,118,210,0.16), transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -110, left: -70, width: 240, height: 240, borderRadius: '50%', background: isNight ? 'radial-gradient(circle, rgba(255,226,89,0.10), transparent 70%)' : 'radial-gradient(circle, rgba(81,255,139,0.12), transparent 70%)' }} />
        </div>

        <button
          onClick={handleClose}
          aria-label={t('notice.close')}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 42,
            height: 42,
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            color: isNight ? '#ffe259' : '#1976d2',
            background: isNight ? 'rgba(255,255,255,0.08)' : 'rgba(25,118,210,0.10)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.14)',
            fontSize: 24,
            lineHeight: '42px',
            fontWeight: 700,
            zIndex: 1,
            backdropFilter: 'blur(8px)',
          }}
        >
          ×
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px',
            borderRadius: 999,
            background: isNight ? 'rgba(81,255,139,0.13)' : 'rgba(25,118,210,0.09)',
            color: isNight ? '#51ff8b' : '#1976d2',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 16,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {t('notice.badge')}
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 16,
          }}
        >
          <div style={{
            padding: '18px 18px 18px',
            borderRadius: 22,
            background: isNight ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
            border: isNight ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(25,118,210,0.08)',
            boxShadow: isNight ? 'inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.70)',
          }}>
            <h2
              style={{
                margin: '0 0 10px',
                fontSize: 'clamp(28px, 4vw, 44px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                fontWeight: 900,
              }}
            >
              {t('notice.title')}
            </h2>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 12px',
              borderRadius: 999,
              background: isNight ? 'rgba(255,226,89,0.12)' : 'rgba(25,118,210,0.08)',
              color: isNight ? '#ffe259' : '#1976d2',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 14,
            }}>
              {t('notice.subtitle')}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(16px, 2vw, 19px)',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
                color: isNight ? 'rgba(255,255,255,0.92)' : '#344054',
              }}
            >
              {notice.description}
            </p>
          </div>

          <div
            style={{
              borderRadius: 22,
              padding: '18px 18px 16px',
              background: isNight ? 'linear-gradient(180deg, rgba(81,255,139,0.08), rgba(255,255,255,0.05))' : 'linear-gradient(180deg, rgba(25,118,210,0.08), rgba(255,255,255,0.58))',
              border: isNight ? '1px solid rgba(81,255,139,0.12)' : '1px solid rgba(25,118,210,0.10)',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, color: isNight ? '#51ff8b' : '#1976d2' }}>
              {t('notice.guidanceTitle')}
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: isNight ? 'rgba(255,255,255,0.82)' : '#475467' }}>
              {t('notice.guidance')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeOverlay;