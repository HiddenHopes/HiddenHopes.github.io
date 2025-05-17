import React from 'react'

const Footer: React.FC = () => (
  <footer style={{
    width: '100%',
    background: 'rgba(20, 30, 40, 0.95)',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem 0',
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 10,
    fontSize: '0.95rem'
  }}>
    <div>
      &copy; {new Date().getFullYear()} School of Happiness. All rights reserved.
    </div>
    <div>
      <a href="https://hiddenhopes.github.io/" style={{ color: '#fff', margin: '0 0.5rem' }}>Live Demo</a> | 
      <a href="https://github.com/hiddenhopes/school-of-happiness" style={{ color: '#fff', margin: '0 0.5rem' }}>GitHub</a>
    </div>
    <div>
      Contact: <a href="mailto:info@schoolofhappiness.com" style={{ color: '#fff' }}>info@schoolofhappiness.com</a>
    </div>
  </footer>
)

export default Footer