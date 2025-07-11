import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DrawingProps {
  width?: number
  height?: number
  style?: React.CSSProperties
  onClose?: () => void
}

const DEFAULT_COLORS = [
  '#222', '#1976d2', '#ff9800', '#51ff8b', '#ffa751', '#e91e63', '#fffbe6', '#b3e0ff', '#a084ee', '#232946'
]

const Drawing: React.FC<DrawingProps> = ({ width = 480, height = 320, style, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#222')
  const [lineWidth, setLineWidth] = useState(4)
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil')

  // Responsive dimensions for mobile
  const [isMobile, setIsMobile] = useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle Escape key to close in mobile mode
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile) {
        if (onClose) {
          onClose();
        } else {
          window.history.back();
        }
      }
    }
    
    if (isMobile) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobile, onClose])

  // Responsive canvas dimensions
  const canvasWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : width
  const canvasHeight = isMobile ? Math.min(window.innerHeight - 200, 300) : height

  // Mouse/touch events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const rect = canvas.getBoundingClientRect()
      ctx.beginPath()
      ctx.moveTo(
        (e.clientX - rect.left) * (canvas.width / rect.width),
        (e.clientY - rect.top) * (canvas.height / rect.height)
      )
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const rect = canvas.getBoundingClientRect()
      ctx.lineTo(
        (e.clientX - rect.left) * (canvas.width / rect.width),
        (e.clientY - rect.top) * (canvas.height / rect.height)
      )
      ctx.strokeStyle = tool === 'eraser' ? '#fff' : color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.stroke()
    }
  }

  const handlePointerUp = () => {
    setDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.closePath()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // UI
  return (
    <>
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
      )}
      
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px #0002',
        padding: isMobile ? 12 : 16,
        display: isMobile ? 'flex' : 'inline-block',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'initial',
        justifyContent: isMobile ? 'center' : 'initial',
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? '50%' : 'auto',
        left: isMobile ? '50%' : 'auto',
        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
        width: isMobile ? '95vw' : 'auto',
        height: isMobile ? '95vh' : 'auto',
        maxWidth: isMobile ? '420px' : 'none',
        zIndex: isMobile ? 1000 : 'auto',
        ...style
      }}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                // Fallback: try to go back in history
                window.history.back();
              }
            }}
            style={{
              position: 'absolute',
              top: 50,
              right: 8,
              background: '#e91e63',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 1001
            }}
          >
            ×
          </button>
        )}
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 8, 
          gap: 1,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: isMobile ? 'center' : 'flex-start',
          width: '100%'
        }}>
        <button
          onClick={() => setTool('pencil')}
          style={{
            background: tool === 'pencil' ? '#1976d2' : '#eee',
            color: tool === 'pencil' ? '#fff' : '#222',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 4
          }}
        >✏️ {t('drawing.pencil')}</button>
        <button
          onClick={() => setTool('eraser')}
          style={{
            background: tool === 'eraser' ? '#1976d2' : '#eee',
            color: tool === 'eraser' ? '#fff' : '#222',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 8
          }}
        >🧽 {t('drawing.eraser')}</button>
        <span style={{ marginRight: 8 }}>{t('drawing.width')}:</span>
        <input
          type="range"
          min={2}
          max={32}
          value={lineWidth}
          onChange={e => setLineWidth(Number(e.target.value))}
          style={{ verticalAlign: 'middle' }}
        />
        <span style={{ width: 28, display: 'inline-block', textAlign: 'center' }}>{lineWidth}</span>
        <span style={{ marginLeft: 8, marginRight: 4 }}>{t('drawing.color')}:</span>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          disabled={tool === 'eraser'}
          style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer' }}
        />
        {DEFAULT_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            disabled={tool === 'eraser'}
            style={{
              width: 24,
              height: 24,
              background: c,
              border: color === c ? '2px solid #1976d2' : '1px solid #ccc',
              borderRadius: '50%',
              marginLeft: 2,
              cursor: 'pointer',
              outline: 'none',
              opacity: tool === 'eraser' ? 0.5 : 1
            }}
          />
        ))}
        <button
          onClick={handleClear}
          style={{
            marginLeft: 16,
            background: '#e91e63',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >{t('drawing.clear')}</button>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: '2px solid #1976d2',
          borderRadius: 12,
          background: '#fff',
          cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          touchAction: 'none',
          boxShadow: '0 2px 8px #1976d222',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '100%' : 'none',
          maxHeight: isMobile ? '60vh' : 'none',
          objectFit: isMobile ? 'contain' : 'initial'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  </>
  )
}

export default Drawing
