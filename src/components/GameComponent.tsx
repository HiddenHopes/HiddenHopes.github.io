import React from 'react'
import { FaGamepad } from 'react-icons/fa'

interface GameComponentProps {
  isNight: boolean
  showGameMenu: boolean
  onGameMenuToggle: () => void
  onTicTacToeClick: () => void
  onDrawingClick?: () => void // add prop for drawing
  onFootballClick?: () => void // add prop for football
}

const GameComponent: React.FC<GameComponentProps> = ({
  isNight,
  showGameMenu,
  onGameMenuToggle,
  onTicTacToeClick,
  onDrawingClick,
  onFootballClick
}) => (
  <div style={{ position: 'fixed', bottom: 120, left: 30, zIndex: 30 }}>
    <button
      onClick={onGameMenuToggle}
      title="Games"
      className="game-btn"
      style={{
        width: 56,
        height: 56,
        background: isNight
          ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
          : 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
        color: isNight ? '#51ff8b' : '#232946',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: isNight
          ? '0 0 16px 4px #23294666, 0 2px 12px #0004'
          : '0 0 16px 4px #ffe25966, 0 2px 12px #ffa75133',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        transition: 'background 0.5s, color 0.5s, box-shadow 0.5s'
      }}
    >
      <FaGamepad />
    </button>
    <style>
      {`
        .game-btn:hover {
          background: linear-gradient(135deg, #51ff8b 0%, #1b2735 100%, #00c3ff 100%);
          color: #fff;
          box-shadow: 0 0 32px 8px #51ff8bcc, 0 4px 24px #232946cc;
        }
      `}
    </style>
    {showGameMenu && (
      <div
        style={{
          position: 'absolute',
          bottom: 64,
          left: 0,
          minWidth: 180,
          background: isNight
            ? 'linear-gradient(135deg, #232946 0%, #1b2735 100%)'
            : 'linear-gradient(135deg, #fffbe6 0%, #b3e0ff 100%)',
          color: isNight ? '#fff' : '#232946',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: '0.5rem 0',
          zIndex: 40,
          animation: 'fadeInMenu 0.3s'
        }}
      >
        <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
          onClick={onTicTacToeClick}
          onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          🎮 TicTacToe
        </div>
        <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
          onClick={onDrawingClick}
          onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          🖊️ Drawing
        </div>
        <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
          onClick={() => alert('Cricket coming soon!')}
          onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          🏏 Cricket
        </div>
        <div style={{ padding: '0.7rem 1.2rem', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }}
          onClick={onFootballClick}
          onMouseOver={e => (e.currentTarget.style.background = isNight ? '#1b2735' : '#e3f6ff')}
          onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
        >
          ⚽ Football
        </div>
      </div>
    )}
    <style>
      {`
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}
    </style>
  </div>
)

export default GameComponent
