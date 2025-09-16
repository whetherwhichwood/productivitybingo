'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Plus, Trophy, Calendar, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import BingoBoard from '@/components/BingoBoard'
import KnightGuide from '@/components/KnightGuide'
import SetupWizard from '@/components/SetupWizard'
import MusicControls from '@/components/MusicControls'
import { useMusic } from '@/contexts/MusicContext'

interface User {
  id: string
  name: string
  email: string
  account: {
    name: string
  }
}

interface BingoSquare {
  id: number
  content: string
  type: 'TOLERATION' | 'TASK' | 'FREE_SPACE'
  isCompleted: boolean
}

interface BingoBoard {
  id: string
  size: number
  month: number
  year: number
  squares: BingoSquare[]
  createdAt: Date
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showWizard, setShowWizard] = useState(false)
  const [showNewUser, setShowNewUser] = useState(false)
  const [bingoBoards, setBingoBoards] = useState<BingoBoard[]>([])
  const [currentBoard, setCurrentBoard] = useState<BingoBoard | null>(null)
  const [previousMonthIncompleteTasks, setPreviousMonthIncompleteTasks] = useState<string[]>([])
  const [showTaskCarryoverPrompt, setShowTaskCarryoverPrompt] = useState(false)
  const [rewards, setRewards] = useState([
    { id: '1', name: 'Order my favorite takeout', description: 'Get that delicious meal you\'ve been craving', points: 3 },
    { id: '2', name: 'Buy a new book', description: 'Add something exciting to your reading list', points: 5 },
    { id: '3', name: 'Take a relaxing bath', description: 'Unwind with some self-care time', points: 1 },
    { id: '4', name: 'Go to a movie', description: 'Enjoy a night out at the cinema', points: 10 }
  ])
  const { playBackgroundMusic, stopBackgroundMusic } = useMusic()

  // Get current month and year
  const getCurrentMonthYear = () => {
    const now = new Date()
    return { month: now.getMonth() + 1, year: now.getFullYear() }
  }

  // Get previous month and year
  const getPreviousMonthYear = () => {
    const now = new Date()
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
    return { month: prevMonth.getMonth() + 1, year: prevMonth.getFullYear() }
  }

  // Load current month's board
  const loadCurrentMonthBoard = async () => {
    const { month, year } = getCurrentMonthYear()
    
    // In a real app, this would be an API call
    // For now, we'll simulate loading from localStorage or mock data
    const storedBoards = JSON.parse(localStorage.getItem('bingoBoards') || '[]')
    const currentMonthBoard = storedBoards.find((board: BingoBoard) => 
      board.month === month && board.year === year
    )
    
    if (currentMonthBoard) {
      setCurrentBoard(currentMonthBoard)
    } else {
      // No board for current month, check for previous month's incomplete tasks
      await checkForPreviousMonthTasks()
    }
  }

  // Check for incomplete tasks from previous month
  const checkForPreviousMonthTasks = async () => {
    const { month, year } = getPreviousMonthYear()
    
    // In a real app, this would be an API call
    const storedBoards = JSON.parse(localStorage.getItem('bingoBoards') || '[]')
    const previousMonthBoard = storedBoards.find((board: BingoBoard) => 
      board.month === month && board.year === year
    )
    
    if (previousMonthBoard) {
      const incompleteTasks = previousMonthBoard.squares
        .filter((square: BingoSquare) => !square.isCompleted && square.type !== 'FREE_SPACE')
        .map((square: BingoSquare) => square.content)
      
      if (incompleteTasks.length > 0) {
        setPreviousMonthIncompleteTasks(incompleteTasks)
        setShowTaskCarryoverPrompt(true)
      }
    }
  }

  // Handle task carryover
  const handleTaskCarryover = (carryOver: boolean) => {
    setShowTaskCarryoverPrompt(false)
    if (carryOver) {
      // Open wizard with previous tasks pre-filled
      setShowWizard(true)
    } else {
      // Open wizard normally
      setShowWizard(true)
    }
  }

  useEffect(() => {
    // In a real app, you'd get this from your auth context or API
    const user = {
      id: '1',
      name: 'Sir Knight',
      email: 'knight@castle.com',
      account: {
        name: 'The Smith Family'
      }
    }
    setCurrentUser(user)
    
    // Load current month's board
    loadCurrentMonthBoard()
    
    // Start background music when dashboard loads
    const timer = setTimeout(() => {
      console.log('Starting background music...')
      playBackgroundMusic()
    }, 3000) // Increased delay to ensure files are accessible
    
    return () => {
      clearTimeout(timer)
      stopBackgroundMusic()
    }
  }, [])

  const encouragingMessages = [
    "Your quest for productivity continues! ⚔️",
    "Every completed task brings you closer to victory! 🏆",
    "The realm of achievement awaits your command! 👑",
    "Your dedication inspires all who witness it! ✨",
    "Another day, another opportunity to conquer! 🛡️"
  ]

  const [currentMessage, setCurrentMessage] = useState(
    encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
  )
  const [debugMode, setDebugMode] = useState(false)

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medieval-50 via-knight-50 to-wizard-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-knight-600 mx-auto mb-4"></div>
          <p className="text-medieval-700">Loading your quest...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-50 via-knight-50 to-wizard-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-medieval-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-medieval-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-medieval-800 font-medieval truncate">
                  {currentUser.account?.name || 'Your Quest'}
                </h1>
                <p className="text-sm sm:text-base text-medieval-600 truncate font-medieval">Welcome back, {currentUser.name}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button 
                onClick={() => setShowNewUser(true)}
                className="wizard-button text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 whitespace-nowrap flex items-center"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New User</span>
                <span className="sm:hidden">User</span>
              </button>
              <button className="p-1 sm:p-2 text-medieval-600 hover:text-medieval-800">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Knight Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <KnightGuide message={currentMessage} onMessageChange={setCurrentMessage} showDebug={debugMode} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
        >
          <div className="medieval-card p-3 sm:p-6 text-center">
            <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-medieval-800">0</h3>
            <p className="text-xs sm:text-base text-medieval-600 font-medieval">Bingos This Month</p>
          </div>
          <div className="medieval-card p-3 sm:p-6 text-center">
            <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-knight-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-medieval-800 font-medieval">0</h3>
            <p className="text-xs sm:text-base text-medieval-600 font-medieval">Tasks Completed</p>
          </div>
          <div className="medieval-card p-3 sm:p-6 text-center">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 text-wizard-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-medieval-800 font-medieval">1</h3>
            <p className="text-xs sm:text-base text-medieval-600 font-medieval">Active Users</p>
          </div>
          <div className="medieval-card p-3 sm:p-6 text-center">
            <Crown className="h-8 w-8 sm:h-12 sm:w-12 text-medieval-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-medieval-800 font-medieval">0</h3>
            <p className="text-xs sm:text-base text-medieval-600 font-medieval">Rewards Earned</p>
          </div>
        </motion.div>

        {/* Bingo Boards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-3xl font-bold text-medieval-800 font-medieval">
              Your Bingo Boards
            </h2>
            <button 
              onClick={() => setShowWizard(true)}
              className="wizard-button text-sm sm:text-base px-4 py-2 whitespace-nowrap flex items-center"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Create New Board
            </button>
          </div>

          {!currentBoard ? (
            <div className="text-center py-8 sm:py-12">
              <div className="medieval-card p-6 sm:p-12 max-w-md mx-auto">
                <Crown className="h-12 w-12 sm:h-16 sm:w-16 text-medieval-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-medieval-800 mb-3 sm:mb-4">
                  No Bingo Board for This Month
                </h3>
                <p className="text-sm sm:text-base text-medieval-600 mb-4 sm:mb-6">
                  Create your monthly bingo board to start your productivity quest!
                </p>
                <button 
                  onClick={() => setShowWizard(true)}
                  className="knight-button text-sm sm:text-base px-4 py-2 whitespace-nowrap"
                >
                  Create This Month's Board!
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-medieval-800 mb-2">
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} Bingo Board
                </h2>
                <p className="text-medieval-600">
                  Complete tasks to achieve bingos and claim rewards!
                </p>
              </div>
              <BingoBoard 
                key={currentBoard.id} 
                board={currentBoard} 
                rewards={rewards}
                onRewardClaimed={(reward) => {
                  toast.success(`You claimed: ${reward.name}! 🎁`)
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Task Carryover Prompt Modal */}
      {showTaskCarryoverPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Carry Over Incomplete Tasks?
            </h3>
            <p className="text-gray-600 mb-4">
              You have {previousMonthIncompleteTasks.length} incomplete tasks from last month:
            </p>
            <ul className="text-sm text-gray-500 mb-6 max-h-32 overflow-y-auto">
              {previousMonthIncompleteTasks.map((task, index) => (
                <li key={index} className="mb-1">• {task}</li>
              ))}
            </ul>
            <p className="text-gray-600 mb-6">
              Would you like to bring these over to your new monthly bingo board?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleTaskCarryover(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Start Fresh
              </button>
              <button
                onClick={() => handleTaskCarryover(true)}
                className="flex-1 px-4 py-2 bg-knight-600 text-white rounded-lg hover:bg-knight-700 transition-colors"
              >
                Carry Over
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Setup Wizard Modal */}
      {showWizard && (
        <SetupWizard 
          onClose={() => setShowWizard(false)}
          onComplete={(newBoard) => {
            // Save to localStorage for persistence
            const storedBoards = JSON.parse(localStorage.getItem('bingoBoards') || '[]')
            const updatedBoards = [...storedBoards, newBoard]
            localStorage.setItem('bingoBoards', JSON.stringify(updatedBoards))
            
            setBingoBoards(prev => [...prev, newBoard])
            setCurrentBoard(newBoard)
            setShowWizard(false)
          }}
          previousTasks={previousMonthIncompleteTasks}
        />
      )}

      {/* New User Modal */}
      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <Users className="h-12 w-12 text-wizard-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-medieval-800 font-medieval mb-4">
                Add New User
              </h2>
              <p className="text-medieval-600 mb-6">
                This feature is coming soon! You'll be able to add family members or team members to your productivity quest.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowNewUser(false)}
                  className="knight-button flex-1 whitespace-nowrap"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

        {/* Music Controls */}
        <MusicControls />
        
        {/* Debug Toggle */}
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
              debugMode 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            {debugMode ? 'Debug ON' : 'Debug OFF'}
          </button>
        </div>
      </div>
  )
}
