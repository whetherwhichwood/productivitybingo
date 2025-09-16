'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles, Crown, Star } from 'lucide-react'
import { useMusic } from '@/contexts/MusicContext'

interface Reward {
  id: string
  name: string
  description: string
  points: number
}

interface TreasureChestProps {
  rewards: Reward[]
  onOpen: (reward: Reward) => void
  onClose: () => void
}

export default function TreasureChest({ rewards, onOpen, onClose }: TreasureChestProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const { playTreasureMusic, stopTreasureMusic } = useMusic()

  // Play treasure music when chest opens
  useEffect(() => {
    playTreasureMusic()
    return () => stopTreasureMusic()
  }, []) // Empty dependency array to run only once

  const handleOpen = () => {
    if (rewards.length === 0) return
    
    setIsOpening(true)
    
    // Select a random reward after animation
    setTimeout(() => {
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
      setSelectedReward(randomReward)
    }, 1000)
  }

  const handleClaimReward = () => {
    if (selectedReward) {
      onOpen(selectedReward)
      onClose()
    }
  }

  const getRewardIcon = (points: number) => {
    if (points >= 10) return <Crown className="h-8 w-8 text-yellow-500" />
    if (points >= 5) return <Star className="h-8 w-8 text-orange-500" />
    return <Gift className="h-8 w-8 text-green-500" />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 text-2xl"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 left-4 text-xl"
          >
            ⭐
          </motion.div>
        </div>

        {!isOpening && !selectedReward && (
          <>
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-3xl font-bold text-yellow-800 font-medieval mb-4">
              Treasure Chest!
            </h2>
            <p className="text-yellow-700 mb-6">
              You've completed a bingo! Open the chest to claim your reward!
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleOpen}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Open Chest! 🗝️
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 border-2 border-yellow-300 text-yellow-700 rounded-lg hover:border-yellow-400 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </>
        )}

        {isOpening && !selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-6xl"
            >
              🎁
            </motion.div>
            <h3 className="text-2xl font-bold text-yellow-800 font-medieval">
              Opening...
            </h3>
            <div className="flex justify-center space-x-1">
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-yellow-500 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-orange-500 rounded-full"
              />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-yellow-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {selectedReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            
            <h3 className="text-2xl font-bold text-yellow-800 font-medieval mb-2">
              Congratulations!
            </h3>
            
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getRewardIcon(selectedReward.points)}
                <span className="text-lg font-bold text-yellow-800">
                  {selectedReward.name}
                </span>
              </div>
              {selectedReward.description && (
                <p className="text-yellow-700 text-sm">
                  {selectedReward.description}
                </p>
              )}
              <div className="flex items-center justify-center space-x-1 mt-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">
                  {selectedReward.points} points
                </span>
              </div>
            </div>
            
            <button
              onClick={handleClaimReward}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Claim Reward! 🏆
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
