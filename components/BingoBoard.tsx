'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Trophy, Target, CheckCircle } from 'lucide-react'
import Confetti from 'react-confetti'
import TreasureChest from './TreasureChest'

interface BingoSquare {
  id: number
  content: string
  type: 'TOLERATION' | 'TASK' | 'FREE_SPACE'
  isCompleted: boolean
}

interface Reward {
  id: string
  name: string
  description: string
  points: number
}

interface BingoBoardProps {
  board: {
    id: string
    size: number
    month: number
    year: number
    squares: BingoSquare[]
    createdAt: Date
  }
  rewards?: Reward[]
  onRewardClaimed?: (reward: Reward) => void
}

export default function BingoBoard({ board, rewards = [], onRewardClaimed }: BingoBoardProps) {
  const [squares, setSquares] = useState(board.squares)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedBingos, setCompletedBingos] = useState<string[]>([])
  const [showTreasureChest, setShowTreasureChest] = useState(false)

  const toggleSquare = (squareId: number) => {
    setSquares(prev => {
      const newSquares = prev.map(square => 
        square.id === squareId 
          ? { ...square, isCompleted: !square.isCompleted }
          : square
      )
      
      // Check for bingos after update
      checkForBingos(newSquares)
      
      return newSquares
    })
  }

  const checkForBingos = (squares: BingoSquare[]) => {
    const size = board.size
    const newBingos: string[] = []
    
    // Check rows
    for (let row = 0; row < size; row++) {
      const rowSquares = squares.slice(row * size, (row + 1) * size)
      if (rowSquares.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
        newBingos.push(`row-${row}`)
      }
    }
    
    // Check columns
    for (let col = 0; col < size; col++) {
      const colSquares = squares.filter((_, index) => index % size === col)
      if (colSquares.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
        newBingos.push(`col-${col}`)
      }
    }
    
    // Check diagonals
    const diagonal1 = squares.filter((_, index) => index % (size + 1) === 0)
    if (diagonal1.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
      newBingos.push('diagonal-1')
    }
    
    const diagonal2 = squares.filter((_, index) => {
      const row = Math.floor(index / size)
      const col = index % size
      return row + col === size - 1
    })
    if (diagonal2.every(square => square.isCompleted || square.type === 'FREE_SPACE')) {
      newBingos.push('diagonal-2')
    }
    
    // Check if there are new bingos
    const newBingoCount = newBingos.filter(bingo => !completedBingos.includes(bingo)).length
    if (newBingoCount > 0) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      
      // Show treasure chest if there are rewards available
      if (rewards.length > 0) {
        setShowTreasureChest(true)
      }
    }
    
    setCompletedBingos(newBingos)
  }

  const getSquareClass = (square: BingoSquare) => {
    let baseClass = 'bingo-square cursor-pointer select-none'
    
    if (square.type === 'FREE_SPACE') {
      baseClass += ' free-space'
    } else if (square.isCompleted) {
      baseClass += ' completed'
    }
    
    return baseClass
  }

  const getSquareIcon = (square: BingoSquare) => {
    if (square.type === 'FREE_SPACE') {
      return '🎯'
    } else if (square.isCompleted) {
      return '✅'
    } else if (square.type === 'TOLERATION') {
      return '⚡'
    } else {
      return '📋'
    }
  }

  const completedCount = squares.filter(s => s.isCompleted).length
  const totalCount = squares.length - 1 // Exclude free space from total
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="medieval-card p-6 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={400}
          height={400}
          recycle={false}
          numberOfPieces={100}
        />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-medieval-600" />
          <span className="font-bold text-medieval-800">
            {new Date(board.year, board.month - 1).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-bold text-medieval-800">
            {completedBingos.length} Bingos
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-medieval-600 mb-2">
          <span>Progress</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="w-full bg-medieval-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-knight-500 to-wizard-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Bingo Grid */}
      <div 
        className="grid gap-1 mb-4"
        style={{ 
          gridTemplateColumns: `repeat(${board.size}, 1fr)`,
          aspectRatio: '1'
        }}
      >
        {squares.map((square) => (
          <motion.button
            key={square.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSquare(square.id)}
            className={getSquareClass(square)}
            disabled={square.type === 'FREE_SPACE'}
          >
            <div className="text-xs font-medium leading-tight">
              {square.content}
            </div>
            <div className="absolute top-1 right-1 text-lg">
              {getSquareIcon(square)}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 text-xs text-medieval-600">
        <div className="flex items-center space-x-1">
          <span>⚡</span>
          <span>Tolerations</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>📋</span>
          <span>Tasks</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🎯</span>
          <span>Free Space</span>
        </div>
      </div>

      {/* Completion Celebration */}
      {completedBingos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg text-center"
        >
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-bold text-medieval-800">
            {completedBingos.length} Bingo{completedBingos.length > 1 ? 's' : ''} Complete!
          </div>
          <div className="text-sm text-medieval-600">
            You're on fire! Keep up the great work! 🔥
          </div>
        </motion.div>
      )}

      {/* Treasure Chest Modal */}
      {showTreasureChest && (
        <TreasureChest
          rewards={rewards}
          onOpen={(reward) => {
            onRewardClaimed?.(reward)
            setShowTreasureChest(false)
          }}
          onClose={() => setShowTreasureChest(false)}
        />
      )}
    </div>
  )
}
