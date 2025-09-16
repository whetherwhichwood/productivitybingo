'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wand2, Target, Gift, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import OrcWizard from './OrcWizard'
import { useMusic } from '@/contexts/MusicContext'

interface SetupWizardProps {
  onClose: () => void
  onComplete: (board: any) => void
  previousTasks?: string[]
}

interface WizardData {
  boardSize: number
  tolerations: string[]
  tasks: string[]
  rewards: string[]
}

export default function SetupWizard({ onClose, onComplete, previousTasks = [] }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [wizardData, setWizardData] = useState<WizardData>({
    boardSize: 3,
    tolerations: [],
    tasks: previousTasks, // Pre-fill with previous tasks
    rewards: []
  })
  const [orcMessage, setOrcMessage] = useState("")
  const { playWizardMusic, stopWizardMusic } = useMusic()

  // Play wizard music when wizard opens
  useEffect(() => {
    playWizardMusic()
    return () => stopWizardMusic()
  }, []) // Empty dependency array to run only once

  const steps = [
    { id: 'size', title: 'Choose Board Size', icon: Target },
    { id: 'tolerations', title: 'List Tolerations', icon: Target },
    { id: 'tasks', title: 'Add Tasks', icon: Target },
    { id: 'rewards', title: 'Set Rewards', icon: Gift },
    { id: 'complete', title: 'Complete Setup', icon: Check }
  ]

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 2) { // Tasks step - only validate here
      const neededItems = (wizardData.boardSize * wizardData.boardSize) - 1
      const totalItems = wizardData.tolerations.length + wizardData.tasks.length
      
      if (totalItems < neededItems) {
        toast.error(`You need at least ${neededItems} total items (tolerations + tasks). You have ${totalItems}. Please add more!`)
        return
      }
    }
    
    if (currentStep === 3) { // Rewards step
      if (wizardData.rewards.length === 0) {
        toast.error('Please add at least one reward to motivate yourself!')
        return
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setOrcMessage("") // Clear orc message when changing steps
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setOrcMessage("") // Clear orc message when changing steps
    }
  }

  const getWizardMessage = () => {
    // Use orc message if available, otherwise use default messages
    if (orcMessage) {
      return orcMessage
    }
    
    switch (currentStep) {
      case 0:
        return "Welcome, brave adventurer! I'll help you create your productivity quest. First, choose the difficulty of your challenge!"
      case 1:
        return "Now, tell me about the things that have been bothering you - those pesky tasks that keep getting put off!"
      case 2:
        return "Excellent! Now let's add some regular tasks to your quest. What else needs to be done?"
      case 3:
        return "Perfect! Now for the most important part - what rewards will motivate you to complete your quest?"
      case 4:
        return "Magnificent! Your quest is ready. Time to begin your adventure!"
      default:
        return "Let's create your productivity quest together!"
    }
  }

  const handleComplete = () => {
    // Create the bingo board
    const newBoard = {
      id: Date.now().toString(),
      size: wizardData.boardSize,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      squares: generateBingoSquares(),
      createdAt: new Date()
    }
    
    // Stop wizard music and resume background music
    stopWizardMusic()
    
    onComplete(newBoard)
    toast.success('Your bingo board has been created! Time to start your quest! ⚔️')
  }

  const generateBingoSquares = () => {
    const totalSquares = wizardData.boardSize * wizardData.boardSize
    const freeSpaceIndex = wizardData.boardSize % 2 === 1 
      ? Math.floor(totalSquares / 2) // Middle for odd sizes
      : Math.floor(Math.random() * totalSquares) // Random for even sizes (like 4x4)
    const squares = []
    
    // Combine tolerations and tasks
    const allItems = [...wizardData.tolerations, ...wizardData.tasks]
    
    // Ensure we have enough items (excluding free space)
    const neededItems = totalSquares - 1 // -1 for free space
    
    for (let i = 0; i < totalSquares; i++) {
      if (i === freeSpaceIndex) {
        squares.push({
          id: i,
          content: 'FREE SPACE',
          type: 'FREE_SPACE',
          isCompleted: false
        })
      } else {
        const itemIndex = i > freeSpaceIndex ? i - 1 : i
        squares.push({
          id: i,
          content: allItems[itemIndex % allItems.length] || `Task ${i + 1}`,
          type: i < wizardData.tolerations.length ? 'TOLERATION' : 'TASK',
          isCompleted: false
        })
      }
    }
    
    return squares
  }

  const addItem = (type: 'tolerations' | 'tasks' | 'rewards', value: string) => {
    if (value.trim()) {
      setWizardData(prev => ({
        ...prev,
        [type]: [...prev[type], value.trim()]
      }))
    }
  }

  const removeItem = (type: 'tolerations' | 'tasks' | 'rewards', index: number) => {
    setWizardData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const duplicateItem = (type: 'tolerations' | 'tasks' | 'rewards', index: number) => {
    setWizardData(prev => ({
      ...prev,
      [type]: [...prev[type], prev[type][index]]
    }))
  }

  const handleClose = () => {
    // Stop wizard music and resume background music
    stopWizardMusic()
    onClose()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 text-center mb-8 font-medieval">
              Choose Your Quest Difficulty
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[3, 4, 5].map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWizardData(prev => ({ ...prev, boardSize: size }))}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    wizardData.boardSize === size
                      ? 'border-knight-500 bg-knight-50'
                      : 'border-medieval-200 hover:border-knight-300'
                  }`}
                >
                  <div className="text-4xl font-bold text-medieval-800 mb-2 font-medieval">
                    {size}×{size}
                  </div>
                  <div className="text-medieval-600 font-medieval">
                    {size === 3 ? 'Easy Quest' : size === 4 ? 'Medium Quest' : 'Hard Quest'}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 1:
        const neededItems = (wizardData.boardSize * wizardData.boardSize) - 1
        const currentTotal = wizardData.tolerations.length + wizardData.tasks.length
        return (
          <div className="space-y-6">
            <div className="bg-knight-50 p-4 rounded-lg text-center">
              <p className="text-knight-800 font-medium">
                You need <span className="font-bold">{neededItems}</span> total items for your {wizardData.boardSize}×{wizardData.boardSize} board
              </p>
              <p className="text-knight-600 text-sm">
                Current: {currentTotal} items ({neededItems - currentTotal} more needed)
              </p>
              <p className="text-knight-600 text-xs mt-2">
                💡 You don't need to fill all slots here - you'll add more tasks on the next step!
              </p>
            </div>
            
            <ItemList
              items={wizardData.tolerations}
              placeholder="e.g., Fix the broken cabinet door"
              onAdd={(value) => addItem('tolerations', value)}
              onRemove={(index) => removeItem('tolerations', index)}
            />
          </div>
        )

      case 2:
        const neededItems2 = (wizardData.boardSize * wizardData.boardSize) - 1
        const currentTotal2 = wizardData.tolerations.length + wizardData.tasks.length
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 text-center mb-8">
              What Else Needs Doing?
            </h3>
            <p className="text-medieval-600 text-center mb-6">
              Add other tasks and activities you want to accomplish
            </p>
            
            <div className="bg-wizard-50 p-4 rounded-lg text-center">
              <p className="text-wizard-800 font-medium">
                You need <span className="font-bold">{neededItems2}</span> total items for your {wizardData.boardSize}×{wizardData.boardSize} board
              </p>
              <p className="text-wizard-600 text-sm">
                Current: {currentTotal2} items ({neededItems2 - currentTotal2} more needed)
              </p>
            </div>
            
            <ItemList
              items={wizardData.tasks}
              placeholder="e.g., Call the dentist"
              onAdd={(value) => addItem('tasks', value)}
              onRemove={(index) => removeItem('tasks', index)}
              onDuplicate={(index) => duplicateItem('tasks', index)}
              showDuplicate={true}
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 text-center mb-8 font-medieval">
              What Rewards Will Motivate You?
            </h3>
            <p className="text-medieval-600 text-center mb-6">
              Set up rewards for completing bingos - these should be things you really want!
            </p>
            <ItemList
              items={wizardData.rewards}
              placeholder="e.g., Order my favorite takeout"
              onAdd={(value) => addItem('rewards', value)}
              onRemove={(index) => removeItem('rewards', index)}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h3 className="text-2xl font-bold text-medieval-800 mb-4">
              Your Quest is Ready!
            </h3>
            <p className="text-medieval-600 mb-6">
              Your {wizardData.boardSize}×{wizardData.boardSize} bingo board has been created with:
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="medieval-card p-4">
                <div className="font-bold text-medieval-800">{wizardData.tolerations.length}</div>
                <div className="text-medieval-600">Tolerations</div>
              </div>
              <div className="medieval-card p-4">
                <div className="font-bold text-medieval-800">{wizardData.tasks.length}</div>
                <div className="text-medieval-600">Tasks</div>
              </div>
              <div className="medieval-card p-4">
                <div className="font-bold text-medieval-800">{wizardData.rewards.length}</div>
                <div className="text-medieval-600">Rewards</div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[98vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-wizard-500 to-knight-500 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold font-medieval">Setup Wizard</h2>
                <p className="text-wizard-100 text-sm sm:text-base">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Orc Wizard Guide */}
        <div className="px-8 pt-4">
          <OrcWizard 
            message={getWizardMessage()}
            isActive={currentStep < steps.length - 1}
            onMessageChange={setOrcMessage}
            showDebug={true}
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center flex-shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-medieval-600 hover:text-medieval-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medieval">Previous</span>
          </button>
          
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="wizard-button text-sm sm:text-base px-3 sm:px-4 py-2 whitespace-nowrap flex items-center"
            >
              <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="font-medieval">Complete Setup!</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="knight-button text-sm sm:text-base px-3 sm:px-4 py-2 whitespace-nowrap flex items-center"
            >
              <span className="font-medieval">Next</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface ItemListProps {
  items: string[]
  placeholder: string
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  onDuplicate?: (index: number) => void
  showDuplicate?: boolean
}

function ItemList({ items, placeholder, onAdd, onRemove, onDuplicate, showDuplicate = false }: ItemListProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(inputValue)
    setInputValue('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
        />
        <button
          type="submit"
          className="knight-button px-4 py-2"
        >
          Add
        </button>
      </form>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-medieval-50 p-3 rounded-lg"
          >
            <span className="text-medieval-800">{item}</span>
            <div className="flex items-center space-x-2">
              {showDuplicate && onDuplicate && (
                <button
                  onClick={() => onDuplicate(index)}
                  className="text-medieval-400 hover:text-medieval-600"
                  title="Duplicate this item"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onRemove(index)}
                className="text-medieval-400 hover:text-medieval-600"
                title="Remove this item"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
