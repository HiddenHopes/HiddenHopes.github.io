import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

const BOARD_SIZE = 3

function checkWinner(board: string[][]) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2])
      return board[i][0]
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i])
      return board[0][i]
  }
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2])
    return board[0][0]
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0])
    return board[0][2]
  return null
}

function getEmptyCells(board: string[][]) {
  const cells: [number, number][] = []
  for (let i = 0; i < BOARD_SIZE; i++)
    for (let j = 0; j < BOARD_SIZE; j++)
      if (!board[i][j]) cells.push([i, j])
  return cells
}

// Minimax with depth limit for adjustable difficulty
function computerMove(board: string[][]) {
  const MAX_DEPTH = 2; // Increase for harder, decrease for easier (2-3 is medium, 4+ is hard)
  // Minimax AI for TicTacToe (hard to beat)
  function minimax(board: string[][], isMaximizing: boolean, depth: number): { score: number, move?: [number, number] } {
    const winner = checkWinner(board)
    if (winner === 'O') return { score: 1 }
    if (winner === 'X') return { score: -1 }
    if (getEmptyCells(board).length === 0) return { score: 0 }
    if (depth >= MAX_DEPTH) return { score: 0 } // Stop search at depth

    let bestScore = isMaximizing ? -Infinity : Infinity
    let bestMove: [number, number] | undefined = undefined
    for (const [i, j] of getEmptyCells(board)) {
      const newBoard = board.map(row => [...row])
      newBoard[i][j] = isMaximizing ? 'O' : 'X'
      const { score } = minimax(newBoard, !isMaximizing, depth + 1)
      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score
          bestMove = [i, j]
        }
      } else {
        if (score < bestScore) {
          bestScore = score
          bestMove = [i, j]
        }
      }
    }
    return { score: bestScore, move: bestMove }
  }

  const result = minimax(board, true, 0)
  if (!result.move) return board
  const [i, j] = result.move
  const newBoard = board.map(row => [...row])
  newBoard[i][j] = 'O'
  return newBoard
}

// 3D Cross
function Cross3D() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.6, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#51ff8b"
          emissive="#51ff8b"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.6, 0.12, 0.12]} />
        <meshStandardMaterial
          color="#51ff8b"
          emissive="#51ff8b"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

// 3D Ring (O)
function Ring3D() {
  return (
    <mesh>
      <torusGeometry args={[0.28, 0.09, 24, 64]} />
      <meshStandardMaterial
        color="#ffa751"
        emissive="#ffa751"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// 3D Board
function Board3D() {
  return (
    <mesh receiveShadow position={[0, 0, -0.18]}>
      <boxGeometry args={[3.1, 3.1, 0.3]} />
      <meshStandardMaterial
        color="#232946"
        metalness={0.2}
        roughness={0.7}
      />
    </mesh>
  )
}

// 3D Grid lines
function GridLines3D() {
  const lines = []
  for (let i = 1; i < BOARD_SIZE; i++) {
    // Vertical
    lines.push(
      <mesh key={`v${i}`} position={[-1.5 + i, 0, 0.01]}>
        <boxGeometry args={[0.06, 3, 0.04]} />
        <meshStandardMaterial color="#b3e0ff" />
      </mesh>
    )
    // Horizontal
    lines.push(
      <mesh key={`h${i}`} position={[0, -1.5 + i, 0.01]}>
        <boxGeometry args={[3, 0.06, 0.04]} />
        <meshStandardMaterial color="#b3e0ff" />
      </mesh>
    )
  }
  return <group>{lines}</group>
}

// Add prop type for extensibility
interface TicTacToe3DProps {
  onClose?: () => void;
}

const TicTacToe3D: React.FC<TicTacToe3DProps> = ({ onClose }) => {
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(''))
  )
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const winner = checkWinner(board)
  const isDraw = !winner && getEmptyCells(board).length === 0

  // Restart handler
  function handleRestart() {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill('')))
    setTurn('X')
  }

  // Computer move
  React.useEffect(() => {
    if (turn === 'O' && !winner && !isDraw) {
      setTimeout(() => {
        setBoard(b => computerMove(b))
        setTurn('X')
      }, 600)
    }
  }, [turn, winner, isDraw])

  function handleCellClick(i: number, j: number) {
    if (board[i][j] || winner || turn !== 'X') return
    const newBoard = board.map(row => [...row])
    newBoard[i][j] = 'X'
    setBoard(newBoard)
    setTurn('O')
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Close and Restart Buttons */}
      <Html position={[1.7, 2.5, 0.35]} center style={{ pointerEvents: 'auto', display: 'flex', gap: 8 }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'rgba(30,30,30,0.85)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 22,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            aria-label="Close game"
          >
            ×
          </button>
        )}
        <button
          onClick={handleRestart}
          style={{
            background: 'rgba(30,30,30,0.85)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 36,
            height: 36,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          aria-label="Restart game"
          title="Restart"
        >
          ↻
        </button>
      </Html>
      <Board3D />
      <GridLines3D />
      {/* Cells */}
      {[0, 1, 2].map(i =>
        [0, 1, 2].map(j => (
          <group key={i + '-' + j} position={[j - 1, 1 - i, 0]}>
            {/* Clickable area */}
            <mesh
              onClick={() => handleCellClick(i, j)}
              position={[0, 0, 0.16]}
              visible={!board[i][j] && !winner}
            >
              <boxGeometry args={[0.92, 0.92, 0.1]} />
              <meshStandardMaterial
                color="#e3f6ff"
                opacity={0.15}
                transparent
              />
            </mesh>
            {/* X or O */}
            {board[i][j] === 'X' && <Cross3D />}
            {board[i][j] === 'O' && <Ring3D />}
          </group>
        ))
        )}  
      {/* Floating status text above the board */}
      <mesh position={[0, 2.2, 0.3]}>
        <planeGeometry args={[2.8, 0.5]} />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>
      <Html position={[0, 2.2, 0.31]} center style={{ color: '#fff', fontSize: 22, fontWeight: 600, textAlign: 'center' }}>
        {winner
          ? winner === 'X'
            ? 'You Win! 🎉'
            : 'Computer Wins! 🤖'
          : isDraw
          ? 'Draw!'
          : 'Your Turn'}
      </Html>
    </group>
  )
}

export default TicTacToe3D