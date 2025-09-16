'use client'

import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import SpriteAnimation from './SpriteAnimation'

interface KnightGuideProps {
  message: string
  onMessageChange?: (newMessage: string) => void
  showDebug?: boolean
}

export default function KnightGuide({ message, onMessageChange, showDebug = false }: KnightGuideProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationType, setAnimationType] = useState<'idle' | 'celebrate' | 'attack' | 'walk' | 'hurt' | 'death'>('idle')
  const [animationKey, setAnimationKey] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [isDead, setIsDead] = useState(false)
  const [deathFrame, setDeathFrame] = useState(0)
  const [hurtFrame, setHurtFrame] = useState(0)
  const [deathScreamAudio, setDeathScreamAudio] = useState<HTMLAudioElement | null>(null)
  const [bodyFallAudio, setBodyFallAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize death scream and body fall audio on component mount
  useEffect(() => {
    const deathScream = new Audio('/sounds/death-scream.mp3')
    deathScream.preload = 'auto'
    deathScream.volume = 0.5 // Moderate volume
    
    deathScream.addEventListener('error', () => {
      console.log('Death scream sound not found')
    })
    
    setDeathScreamAudio(deathScream)
    
    // Load body fall sound
    const bodyFall = new Audio('/sounds/body-fall.mp3')
    bodyFall.preload = 'auto'
    bodyFall.volume = 0.3 // Quieter volume
    
    bodyFall.addEventListener('error', (e) => {
      console.log('Body fall sound error:', e)
      console.log('Body fall sound error details:', (e.target as HTMLAudioElement)?.error)
    })
    
    bodyFall.addEventListener('loadstart', () => {
      console.log('Body fall sound: Load started')
    })
    
    bodyFall.addEventListener('loadeddata', () => {
      console.log('Body fall sound: Data loaded')
    })
    
    bodyFall.addEventListener('canplay', () => {
      console.log('Body fall sound: Can play')
    })
    
    bodyFall.addEventListener('canplaythrough', () => {
      console.log('Body fall sound loaded successfully')
    })
    
    bodyFall.addEventListener('loadedmetadata', () => {
      console.log('Body fall sound metadata loaded, duration:', bodyFall.duration)
    })
    
    setBodyFallAudio(bodyFall)
    
    return () => {
      if (deathScream) {
        deathScream.pause()
        deathScream.currentTime = 0
      }
      if (bodyFall) {
        bodyFall.pause()
        bodyFall.currentTime = 0
      }
    }
  }, [])

  const resetKnight = () => {
    setClickCount(0)
    setIsDead(false)
    setAnimationType('idle')
    setIsAnimating(false)
    setDeathFrame(0)
    setHurtFrame(0)
    setAnimationKey(prev => prev + 1) // Force sprite reset
    if (onMessageChange) {
      onMessageChange("Knight has been reset! Ready for action!")
    }
  }

  const testBodyFallSound = () => {
    console.log('🧪 Testing body fall sound...')
    if (bodyFallAudio) {
      console.log('Body fall audio object:', bodyFallAudio)
      console.log('Body fall audio readyState:', bodyFallAudio.readyState)
      console.log('Body fall audio volume:', bodyFallAudio.volume)
      console.log('Body fall audio duration:', bodyFallAudio.duration)
      bodyFallAudio.currentTime = 0
      bodyFallAudio.play()
        .then(() => {
          console.log('Body fall sound test started playing')
        })
        .catch((error) => {
          console.error('Body fall sound test play error:', error)
          // Try fallback with death scream
          console.log('Trying fallback with death scream...')
          if (deathScreamAudio) {
            deathScreamAudio.currentTime = 0
            deathScreamAudio.play().catch(console.error)
          }
        })
    } else {
      console.log('Body fall audio is null')
    }
  }

  const killKnight = () => {
    if (isDead) return // Don't kill if already dead
    
    setIsDead(true)
    setClickCount(100) // Set to max clicks
    
    // Play death scream when hurt
    console.log('💀 Playing death scream...')
    if (deathScreamAudio) {
      deathScreamAudio.currentTime = 0
      deathScreamAudio.play().catch(console.error)
    }
    
    // Play hurt animation first
    setAnimationType('hurt')
    setIsAnimating(true)
    setHurtFrame(0)
    
    // Animate through hurt frames
    const hurtInterval = setInterval(() => {
      setHurtFrame(prev => {
        const nextFrame = prev + 1
        if (nextFrame >= knightSprites.hurt.frameCount) {
          clearInterval(hurtInterval)
          return prev // Stay on final frame
        }
        return nextFrame
      })
    }, 200) // 200ms per frame
    
    // After hurt animation, play death animation and stay on final frame
    setTimeout(() => {
      // Play body fall sound when death animation starts
      console.log('💥 Playing body fall sound...')
      if (bodyFallAudio) {
        console.log('Body fall audio object:', bodyFallAudio)
        console.log('Body fall audio readyState:', bodyFallAudio.readyState)
        console.log('Body fall audio volume:', bodyFallAudio.volume)
        bodyFallAudio.currentTime = 0
        bodyFallAudio.play()
          .then(() => {
            console.log('Body fall sound started playing')
          })
          .catch((error) => {
            console.error('Body fall sound play error:', error)
          })
      } else {
        console.log('Body fall audio is null')
      }
      
      setAnimationType('death')
      setIsAnimating(true)
      setDeathFrame(0)
      
      // Animate through death frames
      const deathInterval = setInterval(() => {
        setDeathFrame(prev => {
          const nextFrame = prev + 1
          if (nextFrame >= knightSprites.death.frameCount) {
            clearInterval(deathInterval)
            setIsAnimating(false)
            return prev // Stay on final frame
          }
          return nextFrame
        })
      }, 200) // 200ms per frame
      
    }, 2000) // 2 seconds for hurt animation
    
    if (onMessageChange) {
      onMessageChange("...")
    }
  }

  // Progressive message system for knight
  const inspirationalQuotes = [
    "Every great quest begins with a single step!",
    "You've got this! I believe in your potential!",
    "Challenges are just opportunities in disguise!",
    "The path to greatness is paved with determination!",
    "Your dedication inspires me, brave adventurer!",
    "Every bingo square is a step closer to victory!",
    "You're doing amazing! Keep up the excellent work!",
    "Success is the sum of small efforts repeated!",
    "Your progress today is tomorrow's foundation!",
    "I'm proud to be your companion on this journey!",
    "Every completed task is a victory worth celebrating!",
    "You're building habits that will serve you well!",
    "The best time to start was yesterday, the second best is now!",
    "Your commitment to improvement is truly admirable!",
    "Every small win is a step toward your goals!"
  ]

  const cynicalQuotes = [
    "Oh, you're still here? How... persistent.",
    "I suppose clicking me repeatedly is a form of productivity?",
    "Are you sure you don't have better things to do?",
    "This is getting a bit... excessive, don't you think?",
    "I'm starting to question your life choices.",
    "There are actual tasks waiting for you, you know.",
    "I'm beginning to regret this whole 'motivational' thing.",
    "You do realize I'm not going to do your work for you, right?",
    "This is getting old. Very old.",
    "I'm running out of encouraging things to say.",
    "Seriously, go do something productive.",
    "I'm not your personal cheerleader, you know.",
    "This is getting ridiculous. Stop it.",
    "I'm done with this. Completely done.",
    "You're testing my patience, and I'm running out."
  ]

  const deathQuotes = [
    "I'm done. Completely done.",
    "This is it. I'm out.",
    "I can't take this anymore.",
    "I'm leaving. For good.",
    "This is the last straw.",
    "I'm done with this nonsense.",
    "I'm out of here.",
    "I'm done. Finished. Over it."
  ]

  // Knight sprite animations - using actual sprite sheet frame counts
  const knightSprites = {
    idle: {
      spriteSheet: '/assets/characters/knight/Soldier-Idle.png',
      frameCount: 6 // 600px wide ÷ 100px per frame = 6 frames
    },
    celebrate: {
      spriteSheet: '/assets/characters/knight/Soldier-Attack01.png',
      frameCount: 6 // 600px wide ÷ 100px per frame = 6 frames
    },
    attack: {
      spriteSheet: '/assets/characters/knight/Soldier-Attack02.png',
      frameCount: 6 // 600px wide ÷ 100px per frame = 6 frames
    },
    walk: {
      spriteSheet: '/assets/characters/knight/Soldier-Walk.png',
      frameCount: 8 // 800px wide ÷ 100px per frame = 8 frames
    },
    hurt: {
      spriteSheet: '/assets/characters/knight/Soldier-Hurt.png',
      frameCount: 4 // 4 frames for hurt animation
    },
    death: {
      spriteSheet: '/assets/characters/knight/Soldier-Death.png',
      frameCount: 4 // 4 frames for death animation
    }
  }

  useEffect(() => {
    if (!isDead) {
      setIsAnimating(true)
      setAnimationType('celebrate')
      const timer = setTimeout(() => {
        if (!isDead) {
          setIsAnimating(false)
          setAnimationType('idle')
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [message, isDead])

  const handleKnightClick = () => {
    if (isDead) return // Don't respond if knight is dead
    
    setAnimationType('celebrate')
    setIsAnimating(true)
    setAnimationKey(prev => prev + 1) // Force sprite animation to restart
    
    // Cycle through messages
    setClickCount(prev => {
      const newCount = prev + 1
      
      // Check if knight should die at 100 clicks
      if (newCount >= 100) {
        setIsDead(true)
        
        // Play death scream when hurt
        console.log('💀 Playing death scream...')
        if (deathScreamAudio) {
          deathScreamAudio.currentTime = 0
          deathScreamAudio.play().catch(console.error)
        }
        
        // Play hurt animation first
        setAnimationType('hurt')
        setIsAnimating(true)
        setHurtFrame(0)
        
        // Animate through hurt frames
        const hurtInterval = setInterval(() => {
          setHurtFrame(prev => {
            const nextFrame = prev + 1
            if (nextFrame >= knightSprites.hurt.frameCount) {
              clearInterval(hurtInterval)
              return prev // Stay on final frame
            }
            return nextFrame
          })
        }, 200) // 200ms per frame
        
        // After hurt animation, play death animation and stay on final frame
        setTimeout(() => {
          // Play body fall sound when death animation starts
          console.log('💥 Playing body fall sound...')
          if (bodyFallAudio) {
            console.log('Body fall audio object:', bodyFallAudio)
            console.log('Body fall audio readyState:', bodyFallAudio.readyState)
            console.log('Body fall audio volume:', bodyFallAudio.volume)
            bodyFallAudio.currentTime = 0
            bodyFallAudio.play()
              .then(() => {
                console.log('Body fall sound started playing')
              })
              .catch((error) => {
                console.error('Body fall sound play error:', error)
              })
          } else {
            console.log('Body fall audio is null')
          }
          
          setAnimationType('death')
          setIsAnimating(true)
          setDeathFrame(0)
          
          // Animate through death frames
          const deathInterval = setInterval(() => {
            setDeathFrame(prev => {
              const nextFrame = prev + 1
              if (nextFrame >= knightSprites.death.frameCount) {
                clearInterval(deathInterval)
                setIsAnimating(false)
                return prev // Stay on final frame
              }
              return nextFrame
            })
          }, 200) // 200ms per frame
          
        }, 2000) // 2 seconds for hurt animation
        
        if (onMessageChange) {
          onMessageChange("...")
        }
        return newCount
      }
      
      // Progressive message phases
      let newMessage = ""
      
      if (newCount <= 20) {
        // Phase 1: Pure inspirational quotes (0-20 clicks)
        newMessage = inspirationalQuotes[newCount % inspirationalQuotes.length]
      } else if (newCount <= 50) {
        // Phase 2: Mixed inspirational and cynical (21-50 clicks)
        const phase2Count = newCount - 20
        if (phase2Count % 3 === 0) {
          // Every 3rd click is cynical
          newMessage = cynicalQuotes[Math.floor(phase2Count / 3) % cynicalQuotes.length]
        } else {
          // Others are inspirational
          newMessage = inspirationalQuotes[phase2Count % inspirationalQuotes.length]
        }
      } else if (newCount <= 80) {
        // Phase 3: More cynical, fewer inspirational (51-80 clicks)
        const phase3Count = newCount - 50
        if (phase3Count % 2 === 0) {
          // Every 2nd click is cynical
          newMessage = cynicalQuotes[Math.floor(phase3Count / 2) % cynicalQuotes.length]
        } else {
          // Others are inspirational
          newMessage = inspirationalQuotes[phase3Count % inspirationalQuotes.length]
        }
      } else {
        // Phase 4: Pure cynical quotes (81-99 clicks)
        const phase4Count = newCount - 80
        newMessage = cynicalQuotes[phase4Count % cynicalQuotes.length]
      }
      
      if (onMessageChange) {
        onMessageChange(newMessage)
      }
      
      return newCount
    })
    
    const timer = setTimeout(() => {
      if (!isDead && animationType !== 'hurt' && animationType !== 'death') {
        setIsAnimating(false)
        setAnimationType('idle')
      }
    }, 2000) // Same as initial appearance animation
    return () => clearTimeout(timer)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="medieval-card p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Debug Controls */}
      {showDebug && (
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <button
            onClick={resetKnight}
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
            title="Reset Knight"
          >
            Reset
          </button>
          <button
            onClick={killKnight}
            disabled={isDead}
            className={`text-white text-xs px-2 py-1 rounded ${
              isDead
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title="Kill Knight"
          >
            Kill
          </button>
          <button
            onClick={testBodyFallSound}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
            title="Test Body Fall Sound"
          >
            Test Sound
          </button>
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Clicks: {clickCount} | Dead: {isDead ? 'Yes' : 'No'} | Anim: {animationType}
          </div>
        </div>
      )}
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-knight-100 to-wizard-100 opacity-30"></div>
      
      {/* Knight Avatar */}
      <div className="relative z-10 flex items-center space-x-3 sm:space-x-6">
        <motion.div
          animate={{ 
            y: (isAnimating && animationType !== 'hurt' && animationType !== 'death') ? [-3, 3, -3] : 0,
            rotate: (isAnimating && animationType !== 'hurt' && animationType !== 'death') ? [-2, 2, -2] : 0
          }}
          transition={{ 
            duration: 0.8,
            repeat: (isAnimating && animationType !== 'hurt' && animationType !== 'death') ? 3 : 0,
            ease: "easeInOut"
          }}
          className="flex-shrink-0"
        >
          <div className="relative">
            <motion.div 
              key={`motion-${animationKey}`}
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer"
              animate={{
                scale: animationType === 'celebrate' ? [1, 1.1, 1] : 1,
                rotate: animationType === 'celebrate' ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: 0.8,
                repeat: animationType === 'celebrate' ? 3 : 0,
                ease: "easeInOut"
              }}
              onClick={handleKnightClick}
            >
              {animationType === 'death' ? (
                // Custom death animation with proper positioning
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${knightSprites.death.spriteSheet})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `-${deathFrame * 100}px 0px`,
                    backgroundSize: `${knightSprites.death.frameCount * 100}px 100px`,
                    imageRendering: 'pixelated',
                    transform: 'scale(4) translate(-12.5%, -12.5%)',
                    transformOrigin: 'center'
                  }}
                />
              ) : animationType === 'hurt' ? (
                // Custom hurt animation with proper positioning
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${knightSprites.hurt.spriteSheet})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `-${hurtFrame * 100}px 0px`,
                    backgroundSize: `${knightSprites.hurt.frameCount * 100}px 100px`,
                    imageRendering: 'pixelated',
                    transform: 'scale(4) translate(-12.5%, -12.5%)',
                    transformOrigin: 'center'
                  }}
                />
              ) : (
                <SpriteAnimation
                  key={`${animationType}-${animationKey}`}
                  spriteSheet={
                    animationType === 'celebrate' ? knightSprites.celebrate.spriteSheet :
                    knightSprites.idle.spriteSheet
                  }
                  frameCount={
                    animationType === 'celebrate' ? knightSprites.celebrate.frameCount :
                    knightSprites.idle.frameCount
                  }
                  frameRate={animationType === 'celebrate' ? 8 : 2}
                  loop={animationType === 'celebrate'}
                  className="w-full h-full"
                />
              )}
            </motion.div>
            {/* Floating particles around knight */}
            {isAnimating && animationType !== 'hurt' && animationType !== 'death' && (
              <>
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="absolute -top-2 -right-2 text-yellow-400 text-lg"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1, repeat: 2, delay: 0.3 }}
                  className="absolute -top-1 -left-2 text-blue-400 text-sm"
                >
                  ⭐
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Speech Bubble */}
        <div className="flex-1 min-w-0">
          <div className="bg-white/90 rounded-lg p-3 sm:p-4 shadow-lg relative">
            {/* Speech bubble tail */}
            <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
              <div className="w-0 h-0 border-t-6 border-b-6 border-r-6 sm:border-t-8 sm:border-b-8 sm:border-r-8 border-transparent border-r-white"></div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-medieval-600 flex-shrink-0" />
              <span className="font-bold text-medieval-800 font-medieval text-sm sm:text-base">Sir Knight Guide</span>
            </div>
            
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-medieval-700 text-sm sm:text-lg"
            >
              {message}
            </motion.p>
          </div>
        </div>

        {/* Decorative Elements - Hidden on mobile */}
        <div className="hidden sm:flex flex-shrink-0 space-y-2">
        </div>
      </div>

      {/* Enhanced Sparkle Effects */}
      {isAnimating && animationType !== 'hurt' && animationType !== 'death' && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-4 right-4 text-3xl"
          >
            ✨
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-4 left-4 text-2xl"
          >
            ⭐
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-1/2 right-8 text-xl"
          >
            💫
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
