import React from 'react';

interface LandingPromoProps {
  isNight: boolean;
  onRegisterCourse: () => void;
  onViewCourseOutline: () => void;
  onClose: () => void;
}

const LandingPromo: React.FC<LandingPromoProps> = ({ isNight, onRegisterCourse, onViewCourseOutline, onClose }) => {
  const [showMore, setShowMore] = React.useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(9, 10, 15, 0.60)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          width: 'min(94vw, 760px)',
          maxHeight: '88vh',
          overflowY: 'auto',
          borderRadius: 24,
          padding: '20px',
          position: 'relative',
          background: isNight
            ? 'linear-gradient(160deg, rgba(18,22,40,0.60), rgba(35,41,70,0.54))'
            : 'linear-gradient(160deg, rgba(255,255,255,0.56), rgba(227,246,255,0.50))',
          color: isNight ? '#fff' : '#232946',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          border: isNight ? '1px solid rgba(81,255,139,0.22)' : '1px solid rgba(25,118,210,0.14)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close promotion"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: isNight ? 'rgba(255,255,255,0.10)' : 'rgba(35,41,70,0.08)',
            color: isNight ? '#fff' : '#232946',
            fontSize: 22,
            lineHeight: '34px',
          }}
        >
          ×
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            borderRadius: 999,
            background: isNight ? 'rgba(81,255,139,0.12)' : 'rgba(25,118,210,0.10)',
            color: isNight ? '#51ff8b' : '#1976d2',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 0.8,
            marginBottom: 14,
          }}
        >
          FREE COURSE ADMISSION
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Rajshahi', accent: isNight ? '#51ff8b' : '#0b7fd6' },
            { label: 'Java', accent: isNight ? '#51ff8b' : '#0b7fd6' },
            { label: 'ReactJS', accent: isNight ? '#51ff8b' : '#0b7fd6' },
          ].map(item => (
            <span
              key={item.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '7px 12px',
                borderRadius: 999,
                background: isNight ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                border: `1px solid ${isNight ? 'rgba(81,255,139,0.18)' : 'rgba(11,127,214,0.14)'}`,
                color: item.accent,
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 0.2,
              }}
            >
              {item.label}
            </span>
          ))}
        </div>

        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 2.2rem)', margin: '0 0 10px 0', lineHeight: 1.12 }}>
          🖥️ Learn Full-Stack Software Development from an Industry Expert – For FREE (First 10 Seats)! 🚀
        </h1>

        <p style={{ margin: '0 0 14px 0', lineHeight: 1.65, fontSize: 'clamp(0.94rem, 1.7vw, 1.03rem)', opacity: 0.95 }}>
          Practical, career-focused full-stack training for students in{' '}
          <span style={{ color: isNight ? '#51ff8b' : '#0b7fd6', fontWeight: 900 }}>Rajshahi</span>.
        </p>

        <button
          onClick={() => setShowMore(prev => !prev)}
          style={{
            border: 'none',
            background: 'transparent',
            color: isNight ? '#51ff8b' : '#1976d2',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            marginBottom: showMore ? 14 : 6,
          }}
        >
          {showMore ? 'See less...' : 'See more...'}
        </button>

        <div
          style={{
            maxHeight: showMore ? 900 : 0,
            opacity: showMore ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s ease, opacity 0.25s ease',
          }}
        >
          <div style={{ display: 'grid', gap: 14, lineHeight: 1.65, fontSize: 'clamp(0.93rem, 1.65vw, 1.02rem)' }}>
            <p style={{ margin: 0 }}>Assalamu Alaikum!</p>
            <p style={{ margin: 0 }}>
              I&apos;m from{' '}
              <span style={{ color: isNight ? '#51ff8b' : '#0b7fd6', fontWeight: 900 }}>Rajshahi</span>{' '}
              and currently working as a Senior Software Engineer at a well-known software company. With over 6 years of industry experience and more than 3 years of online teaching, I’m excited to launch a practical, career-focused Full-Stack Software Development Course.
            </p>
            <p style={{ margin: 0 }}>This course is designed to take you from absolute zero to fully job-ready!</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                '✅ Core Technologies: Java & ReactJS',
                '📍 Eligibility: Exclusive for students based in Rajshahi.',
                '💡 Perfect for students, fresh graduates, and anyone passionate about real-world development and algorithmic thinking.',
              ].map(item => (
                <div
                  key={item}
                  style={{
                    borderRadius: 16,
                    padding: '12px 14px',
                    background: isNight ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.46)',
                    border: '1px solid rgba(127,187,31,0.12)',
                    fontWeight: 600,
                  }}
                >
                  {item.startsWith('✅ Core Technologies') ? (
                    <>
                      ✅ Core Technologies: <span style={{ color: isNight ? '#51ff8b' : '#0b7fd6', fontWeight: 900 }}>Java</span> &{' '}
                      <span style={{ color: isNight ? '#51ff8b' : '#0b7fd6', fontWeight: 900 }}>ReactJS</span>
                    </>
                  ) : item.startsWith('📍 Eligibility') ? (
                    <>
                      📍 Eligibility: Exclusive for students based in{' '}
                      <span style={{ color: isNight ? '#51ff8b' : '#0b7fd6', fontWeight: 900 }}>Rajshahi</span>.
                    </>
                  ) : (
                    item
                  )}
                </div>
              ))}
            </div>

            <div>
              <p style={{ margin: '0 0 8px 0', fontWeight: 800 }}>🗓️ Course Details & Structure:</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>Batch Size: Highly focused learning with a maximum of 10 students per batch.</li>
                <li>Class Schedule: ~8 on-site classes per month on Saturdays & Sundays plus ~4 online classes per month.</li>
                <li>Duration: Each session will be 2+ hours long.</li>
                <li>Regular Fee: Very affordable at just 1,000 Tk per month.</li>
                <li>Trial Period: The first week of classes is completely FREE to try it out.</li>
                <li>Curriculum: The full course outline is provided on our website.</li>
              </ul>
            </div>

            <p style={{ margin: 0, fontWeight: 700 }}>
              🎉 Special Offer: The first 10 students to sign up can join the entire course for FREE!
            </p>
            <p style={{ margin: 0 }}>
              🌐 Visit 👉 https://hiddenhopes.github.io/ and register now to reserve your seat!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 18 }}>
          <button
            onClick={onViewCourseOutline}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '13px 20px',
              cursor: 'pointer',
              background: isNight ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.62)',
              color: isNight ? '#fff' : '#232946',
              fontWeight: 800,
              fontSize: 15,
              boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            }}
          >
            View course outline
          </button>
          <button
            onClick={onRegisterCourse}
            style={{
              border: 'none',
              borderRadius: 999,
              padding: '13px 22px',
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #51ff8b 0%, #1976d2 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              boxShadow: '0 10px 24px rgba(25,118,210,0.28)',
            }}
          >
            Register the course
          </button>
          <button
            onClick={onClose}
            style={{
              borderRadius: 999,
              padding: '13px 20px',
              cursor: 'pointer',
              background: 'transparent',
              color: isNight ? '#fff' : '#232946',
              border: `1px solid ${isNight ? 'rgba(255,255,255,0.28)' : 'rgba(35,41,70,0.18)'}`,
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPromo;