'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sword, Shield, Crown, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-50 via-knight-50 to-wizard-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-wizard-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-knight-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-medieval-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-medieval-600" />
            <h1 className="text-2xl font-bold text-medieval-800 font-medieval">Productivity Bingo</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/login" className="text-medieval-700 hover:text-medieval-900 font-medium transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="knight-button">
              Start Quest
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h2 className="text-6xl md:text-8xl font-bold text-medieval-800 font-medieval mb-6 text-shadow-lg">
              Quest for
              <span className="block bg-gradient-to-r from-wizard-600 to-knight-600 bg-clip-text text-transparent">
                Achievement
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-medieval-700 max-w-3xl mx-auto leading-relaxed">
              Transform your daily tasks into an epic medieval adventure! Complete bingo boards, 
              earn magical rewards, and level up your productivity with our ADHD-friendly platform.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <div className="medieval-card p-8 text-center">
              <Sword className="h-16 w-16 text-knight-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-medieval-800 mb-4 font-medieval">Conquer Tasks</h3>
              <p className="text-medieval-600">
                Turn your tolerations and tasks into a strategic bingo game. 
                Choose from 3x3, 4x4, or 5x5 boards for the perfect challenge level.
              </p>
            </div>

            <div className="medieval-card p-8 text-center">
              <Shield className="h-16 w-16 text-wizard-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-medieval-800 mb-4 font-medieval">Magical Rewards</h3>
              <p className="text-medieval-600">
                Earn points and unlock rewards for completing bingos. 
                Your knight guide will cheer you on with encouraging messages!
              </p>
            </div>

            <div className="medieval-card p-8 text-center">
              <Sparkles className="h-16 w-16 text-medieval-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-medieval-800 mb-4 font-medieval">ADHD Friendly</h3>
              <p className="text-medieval-600">
                Designed with neurodivergent users in mind. 
                Visual feedback, clear progress tracking, and dopamine-rich interactions.
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Link 
              href="/auth/register"
              className="inline-block wizard-button text-2xl px-12 py-6 relative overflow-hidden group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0 
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                Begin Your Quest! ⚔️
              </motion.div>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20"
                />
              )}
            </Link>
            
            <p className="mt-6 text-medieval-600 text-lg">
              Join thousands of adventurers on their productivity journey!
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-medieval-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-medieval-600">
            <p>&copy; 2024 Productivity Bingo. Your quest for achievement starts here! 🏰</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
