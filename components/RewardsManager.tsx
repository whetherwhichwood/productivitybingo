'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Plus, Star, Crown, Trophy, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface Reward {
  id: string
  name: string
  description: string
  points: number
  isRedeemed: boolean
  redeemedAt?: Date
}

interface RewardsManagerProps {
  rewards: Reward[]
  onAddReward: (reward: Omit<Reward, 'id'>) => void
  onRedeemReward: (rewardId: string) => void
  totalPoints: number
}

export default function RewardsManager({ rewards, onAddReward, onRedeemReward, totalPoints }: RewardsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    points: 1,
    isRedeemed: false
  })

  const handleAddReward = () => {
    if (newReward.name.trim()) {
      onAddReward(newReward)
      setNewReward({ name: '', description: '', points: 1, isRedeemed: false })
      setShowAddForm(false)
      toast.success('Reward added to your collection! 🎁')
    }
  }

  const handleRedeemReward = (rewardId: string) => {
    onRedeemReward(rewardId)
    toast.success('Reward redeemed! Enjoy your treat! 🎉')
  }

  const getRewardIcon = (points: number) => {
    if (points >= 10) return <Crown className="h-6 w-6 text-yellow-500" />
    if (points >= 5) return <Trophy className="h-6 w-6 text-orange-500" />
    if (points >= 3) return <Star className="h-6 w-6 text-blue-500" />
    return <Gift className="h-6 w-6 text-green-500" />
  }

  const getRewardRarity = (points: number) => {
    if (points >= 10) return { label: 'Legendary', color: 'text-purple-600 bg-purple-100' }
    if (points >= 5) return { label: 'Epic', color: 'text-orange-600 bg-orange-100' }
    if (points >= 3) return { label: 'Rare', color: 'text-blue-600 bg-blue-100' }
    return { label: 'Common', color: 'text-green-600 bg-green-100' }
  }

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <div className="medieval-card p-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          <h3 className="text-2xl font-bold text-medieval-800">Your Quest Points</h3>
        </div>
        <div className="text-4xl font-bold text-knight-600 mb-2">{totalPoints}</div>
        <p className="text-medieval-600">Points earned through completing bingos!</p>
      </div>

      {/* Add Reward Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-medieval-800 font-medieval">Your Rewards</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="wizard-button"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Reward
        </button>
      </div>

      {/* Add Reward Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="medieval-card p-6"
        >
          <h4 className="text-lg font-bold text-medieval-800 mb-4">Create New Reward</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-medieval-700 mb-2">
                Reward Name
              </label>
              <input
                type="text"
                value={newReward.name}
                onChange={(e) => setNewReward(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                placeholder="e.g., Order my favorite takeout"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-medieval-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newReward.description}
                onChange={(e) => setNewReward(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-medieval-700 mb-2">
                Points Required
              </label>
              <select
                value={newReward.points}
                onChange={(e) => setNewReward(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
              >
                <option value={1}>1 Point - Common</option>
                <option value={3}>3 Points - Rare</option>
                <option value={5}>5 Points - Epic</option>
                <option value={10}>10 Points - Legendary</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddReward}
                className="knight-button"
              >
                Add Reward
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-3 border-2 border-medieval-200 text-medieval-700 rounded-lg hover:border-medieval-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rewards List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => {
          const rarity = getRewardRarity(reward.points)
          const canRedeem = totalPoints >= reward.points && !reward.isRedeemed
          
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`medieval-card p-4 relative ${
                reward.isRedeemed ? 'opacity-60' : ''
              }`}
            >
              {reward.isRedeemed && (
                <div className="absolute top-2 right-2 text-green-500 text-2xl">
                  ✅
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getRewardIcon(reward.points)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-medieval-800 truncate">
                      {reward.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${rarity.color}`}>
                      {rarity.label}
                    </span>
                  </div>
                  
                  {reward.description && (
                    <p className="text-medieval-600 text-sm mb-3">
                      {reward.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-medieval-700">
                        {reward.points} points
                      </span>
                    </div>
                    
                    {canRedeem && (
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        className="px-3 py-1 bg-gradient-to-r from-knight-500 to-wizard-500 text-white text-sm rounded-lg hover:from-knight-600 hover:to-wizard-600 transition-all"
                      >
                        Redeem
                      </button>
                    )}
                    
                    {!canRedeem && !reward.isRedeemed && (
                      <span className="text-sm text-medieval-400">
                        Need {reward.points - totalPoints} more points
                      </span>
                    )}
                  </div>
                  
                  {reward.redeemedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-16 w-16 text-medieval-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-medieval-800 mb-2">No Rewards Yet</h3>
          <p className="text-medieval-600 mb-6">
            Create your first reward to motivate yourself!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="knight-button"
          >
            Create Your First Reward! 🎁
          </button>
        </div>
      )}
    </div>
  )
}
