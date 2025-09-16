'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Mail, Lock, Sword } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Welcome back, brave knight! ⚔️')
        router.push('/dashboard')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Invalid credentials')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-50 via-knight-50 to-wizard-50 flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-wizard-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-knight-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="medieval-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-knight-500 to-wizard-500 rounded-full mb-4"
            >
              <Sword className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-medieval-800 font-medieval mb-2">
              Welcome Back, Knight!
            </h1>
            <p className="text-medieval-600">
              Continue your productivity quest
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-medieval-700 mb-2">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none transition-colors"
                placeholder="knight@castle.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-medieval-700 mb-2">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none transition-colors"
                placeholder="Your secret password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full knight-button text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Enter the Castle! 🏰'}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-medieval-600">
              New to the realm?{' '}
              <Link href="/auth/register" className="text-wizard-600 hover:text-wizard-700 font-medium">
                Start your quest here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
