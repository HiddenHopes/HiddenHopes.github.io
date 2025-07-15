import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DrawingProps {
  width?: number
  height?: number
  style?: React.CSSProperties
  onClose?: () => void
}

const DEFAULT_COLORS = [
  '#222222', '#1976d2', '#ff9800', '#51ff8b', '#ffa751', '#e91e63', '#fffbe6', '#b3e0ff', '#a084ee', '#232946'
]

const Drawing: React.FC<DrawingProps> = ({ width = 480, height = 320, style, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#222222')
  const [lineWidth, setLineWidth] = useState(4)
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'bucket'>('pencil')
  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

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
  const canvasHeight = isMobile ? Math.min(window.innerHeight - 150, 450) : height

  // Helper function to get accurate coordinates
  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY
    
    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0]
      clientX = touch.clientX
      clientY = touch.clientY
    } else {
      // Pointer/Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }
    
    // Account for page scroll
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    
    // Calculate position relative to canvas
    const canvasX = clientX - rect.left
    const canvasY = clientY - rect.top
    
    // Get the actual canvas size vs displayed size
    const displayWidth = rect.width
    const displayHeight = rect.height
    const actualWidth = canvas.width
    const actualHeight = canvas.height
    
    // Calculate scale factors
    const scaleX = actualWidth / displayWidth
    const scaleY = actualHeight / displayHeight
    
    // Apply scaling
    const x = canvasX * scaleX
    const y = canvasY * scaleY
    
    return { x, y }
  }

  // Helper to save current canvas state to undo stack
  const saveState = (clearRedo = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setUndoStack(prev => [...prev, dataUrl]);
    if (clearRedo) setRedoStack([]);
  };

  // Mouse/touch events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Save state before drawing or filling
    saveState(true);

    const coords = getCanvasCoordinates(e)

    if (tool === 'bucket') {
      // Fill area with current color
      floodFill(coords.x, coords.y, color)
    } else {
      // Regular drawing
      setDrawing(true)
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
      
      // Set drawing properties
      ctx.strokeStyle = tool === 'eraser' ? '#fff' : color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!drawing || tool === 'bucket') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const coords = getCanvasCoordinates(e)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
    }
  }

  // Touch events for better mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Restrict to single touch only
    if (e.touches.length > 1) {
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Save state before drawing or filling
    saveState(true);

    const coords = getCanvasCoordinates(e)

    if (tool === 'bucket') {
      // Fill area with current color
      floodFill(coords.x, coords.y, color)
    } else {
      // Regular drawing
      setDrawing(true)
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
      
      // Set drawing properties
      ctx.strokeStyle = tool === 'eraser' ? '#fff' : color
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Restrict to single touch only
    if (e.touches.length > 1) {
      setDrawing(false)
      return
    }
    
    if (!drawing || tool === 'bucket') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const coords = getCanvasCoordinates(e)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Always stop drawing on touch end, regardless of touch count
    setDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.closePath()
  }

  const handlePointerUp = () => {
    setDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.closePath()
  }

  const handleClear = () => {
    saveState(true);
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  // Undo/Redo handlers
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setRedoStack(prev => [...prev, canvas.toDataURL()]);
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = last;
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const last = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setUndoStack(prev => [...prev, canvas.toDataURL()]);
    const img = new window.Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = last;
  };

  // Flood fill algorithm for bucket tool
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    // Convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }

    const fillRgb = hexToRgb(fillColor)
    if (!fillRgb) return

    const getPixelIndex = (x: number, y: number) => (y * width + x) * 4

    const getPixelColor = (x: number, y: number) => {
      const index = getPixelIndex(x, y)
      return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3]
      }
    }

    const setPixelColor = (x: number, y: number, color: {r: number, g: number, b: number, a: number}) => {
      const index = getPixelIndex(x, y)
      data[index] = color.r
      data[index + 1] = color.g
      data[index + 2] = color.b
      data[index + 3] = color.a
    }

    const colorsMatch = (a: {r: number, g: number, b: number, a: number}, b: {r: number, g: number, b: number, a: number}) => {
      return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
    }

    const targetColor = getPixelColor(Math.floor(startX), Math.floor(startY))
    const newColor = { r: fillRgb.r, g: fillRgb.g, b: fillRgb.b, a: 255 }

    // Don't fill if target color is the same as fill color
    if (colorsMatch(targetColor, newColor)) return

    const stack = [{ x: Math.floor(startX), y: Math.floor(startY) }]

    while (stack.length > 0) {
      const { x, y } = stack.pop()!
      
      if (x < 0 || x >= width || y < 0 || y >= height) continue
      
      const currentColor = getPixelColor(x, y)
      if (!colorsMatch(currentColor, targetColor)) continue

      setPixelColor(x, y, newColor)

      // Add neighboring pixels to stack
      stack.push({ x: x + 1, y })
      stack.push({ x: x - 1, y })
      stack.push({ x, y: y + 1 })
      stack.push({ x, y: y - 1 })
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // UI
  return (
    <>
      {isMobile && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Don't close on backdrop click - force user to use close button
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
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
        zIndex: isMobile ? 10000 : 'auto',
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

        {/* Close button for desktop */}
        {!isMobile && (
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
              top: 0,
              right: 0,
              background: '#e91e63',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              fontSize: 14,
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
            color: tool === 'pencil' ? '#ffffff' : '#22222',
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
            color: tool === 'eraser' ? '#ffffff' : '#222222',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 8
          }}
        >🧽 {t('drawing.eraser')}</button>
        <button
          onClick={() => setTool('bucket')}
          style={{
            background: tool === 'bucket' ? '#1976d2' : '#eee',
            color: tool === 'bucket' ? '#ffffff' : '#222222',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 8
          }}
        >🪣 {t('drawing.bucket')}</button>
        <span style={{ marginRight: 8 }}>{t('drawing.width')}:</span>
        <input
          type="range"
          min={2}
          max={32}
          value={lineWidth}
          onChange={e => setLineWidth(Number(e.target.value))}
          style={{ verticalAlign: 'middle' }}
          disabled={tool === 'eraser' || tool === 'bucket'}
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
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          style={{
            marginLeft: 16,
            background: undoStack.length === 0 ? '#ccc' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >↶</button>
        <button
          onClick={handleRedo}
          disabled={redoStack.length === 0}
          style={{
            marginLeft: 4,
            background: redoStack.length === 0 ? '#ccc' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontWeight: 600,
            cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >↷</button>
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
          cursor: tool === 'eraser'
            ? 'cell'
            : tool === 'bucket'
            ? 'url("/cursor-bucket.svg") 8 24, pointer'
            : 'crosshair',
          touchAction: 'none',
          boxShadow: '0 2px 8px #1976d222',
          display: 'block',
          width: isMobile ? `${canvasWidth}px` : 'auto',
          height: isMobile ? `${canvasHeight}px` : 'auto',
          maxWidth: '100%',
          maxHeight: isMobile ? '75vh' : 'none',
          imageRendering: 'pixelated',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          // Additional multitouch restrictions
          msTouchAction: 'none',
          msUserSelect: 'none'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
    </div>
  </>
  )
}

export default Drawing
