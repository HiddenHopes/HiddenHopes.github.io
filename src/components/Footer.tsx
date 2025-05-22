import React from 'react'

interface FooterProps {
  isNight: boolean
}

const Footer: React.FC<FooterProps> = ({ isNight }) => (
  <footer
    style={{
      width: '100%',
      background: isNight
        ? 'linear-gradient(90deg,rgb(28, 89, 158) 0%,rgb(1, 3, 37) 100%)'
        : 'linear-gradient(90deg,rgb(247, 248, 248) 0%,rgb(140, 203, 245) 100%)',
      color: isNight ? '#fff' : '#222',
      textAlign: 'center',
      padding: '1rem 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 10,
      fontSize: '0.95rem',
      boxShadow: isNight
        ? '0 -2px 8px rgba(0,0,0,0.15)'
        : '0 -2px 8px rgba(0,0,0,0.05)',
      transition: 'background 0.3s, color 0.3s'
    }}
  >
    <div>
      &copy; {new Date().getFullYear()} School of Happiness. All rights reserved.
    </div>
    <div>
      <a
        href="https://hiddenhopes.github.io/"
        style={{ color: isNight ? '#fff' : '#222', margin: '0 0.5rem' }}
      >
        Live Demo
      </a>
      |
      <a
        href="https://github.com/hiddenhopes/school-of-happiness"
        style={{ color: isNight ? '#fff' : '#222', margin: '0 0.5rem' }}
      >
        GitHub
      </a>
    </div>
    <div>
      Contact:{' '}
      <a
        href="mailto:info@schoolofhappiness.com"
        style={{ color: isNight ? '#fff' : '#222' }}
      >
        info@schoolofhappiness.com
      </a>
    </div>
  </footer>
)

export default Footer