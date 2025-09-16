'use client'

import { motion } from 'framer-motion'
import { Wand2, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import SpriteAnimation from './SpriteAnimation'

interface OrcWizardProps {
  message: string
  isActive?: boolean
  onMessageChange?: (newMessage: string) => void
  showDebug?: boolean
}

export default function OrcWizard({ message, isActive = false, onMessageChange, showDebug = false }: OrcWizardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationType, setAnimationType] = useState<'idle' | 'cast' | 'walk' | 'attack'>('idle')
  const [messageIndex, setMessageIndex] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [hasLeft, setHasLeft] = useState(false)
  const [finalMessage, setFinalMessage] = useState("")
  const [isWalkingAway, setIsWalkingAway] = useState(false)
  const [hasFinishedWalking, setHasFinishedWalking] = useState(false)
  const [walkCycleCount, setWalkCycleCount] = useState(0)
  const [stepsAudio, setStepsAudio] = useState<HTMLAudioElement | null>(null)
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(true)
  const [monsterScreamAudio, setMonsterScreamAudio] = useState<HTMLAudioElement | null>(null)
  const [doorSlamAudio, setDoorSlamAudio] = useState<HTMLAudioElement | null>(null)

  // Initialize audio on component mount
  useEffect(() => {
    // Try to load the stone steps sound, fallback to a simple beep if not available
    const stepsAudio = new Audio('/sounds/stone-steps.mp3')
    stepsAudio.preload = 'auto'
    stepsAudio.volume = 0.7 // Start at higher volume for fade effect
    
    // Handle audio load errors gracefully
    stepsAudio.addEventListener('error', () => {
      console.log('Stone steps sound not found, using fallback')
    })
    
    setStepsAudio(stepsAudio)
    
    // Load monster scream sound
    const monsterScream = new Audio('/sounds/monster-scream.mp3')
    monsterScream.preload = 'auto'
    monsterScream.volume = 0.4 // Slightly louder than steps
    
    monsterScream.addEventListener('error', () => {
      console.log('Monster scream sound not found')
    })
    
    setMonsterScreamAudio(monsterScream)
    
    // Load door slam sound
    const doorSlam = new Audio('/sounds/door-slam.mp3')
    doorSlam.preload = 'auto'
    doorSlam.volume = 0.5 // Moderate volume
    
    doorSlam.addEventListener('error', () => {
      console.log('Door slam sound not found')
    })
    
    setDoorSlamAudio(doorSlam)
    
    return () => {
      if (stepsAudio) {
        stepsAudio.pause()
        stepsAudio.currentTime = 0
      }
      if (monsterScream) {
        monsterScream.pause()
        monsterScream.currentTime = 0
      }
      if (doorSlam) {
        doorSlam.pause()
        doorSlam.currentTime = 0
      }
    }
  }, [])

  const resetOrc = () => {
    setClickCount(0)
    setHasLeft(false)
    setFinalMessage("")
    setIsWalkingAway(false)
    setHasFinishedWalking(false)
    setWalkCycleCount(0)
    setSpeechBubbleVisible(true)
    setAnimationType('idle')
    setIsAnimating(false)
    if (onMessageChange) {
      onMessageChange("Orc has been reset! Ready for action! 🪄")
    }
  }

  const makeOrcLeave = () => {
    if (hasLeft || isWalkingAway) return // Don't leave if already left or walking
    
    console.log('🟢 Starting orc leave sequence...')
    
    // Select a random final message
    const randomMessage = finalMessages[Math.floor(Math.random() * finalMessages.length)]
    setFinalMessage(randomMessage)
    
    // Clear the current message immediately
    console.log('🟡 Clearing speech bubble text...')
    if (onMessageChange) {
      onMessageChange("")
    }
    
    // Hide speech bubble
    console.log('🟡 Hiding speech bubble...')
    setSpeechBubbleVisible(false)
    
    // Play monster scream 1 second before walking animation
    console.log('👹 Playing monster scream...')
    if (monsterScreamAudio) {
      monsterScreamAudio.currentTime = 15 // Start at 15 seconds
      monsterScreamAudio.play().catch(console.error)
      
      // Stop the monster scream after 3 seconds
      setTimeout(() => {
        if (monsterScreamAudio) {
          monsterScreamAudio.pause()
          monsterScreamAudio.currentTime = 15
        }
      }, 3000) // Stop after 3 seconds
    }
    
    // After speech bubble fades, start walking animation
    setTimeout(() => {
      console.log('🟠 Starting walking animation...')
      setIsWalkingAway(true)
      setAnimationType('walk')
      setIsAnimating(true)
      setWalkCycleCount(0)
      
      // Play steps sound
      if (stepsAudio) {
        stepsAudio.currentTime = 0
        stepsAudio.play().catch(console.error)
      }
      
      // Track walk cycles (8 frames per cycle, 312.5ms per frame = 5s total for 2 cycles)
      const walkInterval = setInterval(() => {
        setWalkCycleCount(prev => {
          const newCycleCount = prev + 1
          console.log(`🟣 Walk cycle: ${newCycleCount}/16`)
          
          // Fade steps volume from 0.7 to 0.5 over 16 frames
          if (stepsAudio) {
            const progress = newCycleCount / 16 // 0 to 1
            const volume = 0.7 - (progress * 0.2) // 0.7 to 0.5
            stepsAudio.volume = Math.max(0.5, volume) // Ensure minimum of 0.5
            console.log(`🔊 Steps volume: ${stepsAudio.volume.toFixed(2)}`)
          }
          
              // After 2 complete cycles (16 frames total), finish walking
              if (newCycleCount >= 16) {
                console.log('🔴 Finishing walk animation...')
                clearInterval(walkInterval)
                setIsWalkingAway(false)
                setHasFinishedWalking(true)
                setIsAnimating(false)
                // Stop the steps sound
                if (stepsAudio) {
                  stepsAudio.pause()
                  stepsAudio.currentTime = 0
                }
                // Delay setting hasLeft to true to allow orc to walk off-screen
                setTimeout(() => {
                  setHasLeft(true)
                  console.log('✅ Orc has left!')
                }, 1000) // Wait 1 second for orc to walk off-screen
              }
          return newCycleCount
        })
      }, 312.5) // 312.5ms per frame to match 5s total duration
    }, 500) // Wait 500ms for speech bubble to fade
  }

  // Progressive message system
  const tips = [
    "Tolerations are those annoying things that keep nagging at you!",
    "Don't fill your whole board with tolerations - mix it up!",
    "Add as many tolerations as you want here, we'll fill the rest later!",
    "Tolerations are perfect for monthly bingo - they add up over time!",
    "Think of tolerations as mental clutter you want to clear out!",
    "You can always add more tasks on the next step!",
    "Tolerations should be actionable - things you can actually do!",
    "Mix tolerations with regular tasks for a balanced quest!",
    "Remember, tolerations are things that drain your mental energy!",
    "A few tolerations each month can make a huge difference!",
    "Don't overthink it - just list what's been bothering you!",
    "Tolerations are like weeds in your mental garden - pull them out!"
  ]

  const mildInsults = [
    "What, can't think of anything? Even a goblin could do better!",
    "Is that all? My grandmother's cat has more problems than you!",
    "Pathetic! A single orc could list more tolerations than this!",
    "Are you even trying? This is weaker than a newborn goblin!",
    "Ha! I've seen more action in a sleeping dragon's cave!",
    "This is embarrassing! Even the village idiot has more tolerations!",
    "What kind of adventurer are you? This is pitiful!",
    "I've seen more substance in a ghost's shadow than this list!",
    "Are you sure you're not a rock? Rocks have more problems!",
    "This is so weak, I'm starting to feel sorry for you!"
  ]

  const extremeInsults = [
    "I'M DONE! This is absolutely ridiculous!",
    "I can't take this anymore! You're hopeless!",
    "I'm wasting my time here! Even a stone has more ambition!",
    "This is the worst list I've ever seen! I'm leaving!",
    "I'M OUT! I can't watch this disaster anymore!",
    "You're impossible! I'm going to find someone competent!",
    "This is torture! I'm abandoning this quest!",
    "I'M DONE WITH YOU! This is a complete waste!",
    "I can't believe I'm stuck with you! I'M LEAVING!",
    "This is the last straw! I'M OUT OF HERE!"
  ]

  const finalMessages = [
    "You just annoyed your guide into early retirement. I bet you're a blast in elevators.",
    "You've proven that persistence and poor judgment are the same thing.",
    "You broke the orc. Hope your family dinners aren't this unbearable.",
    "If there were a medal for pointless persistence, you'd have annoyed the blacksmith that makes them into quitting too.",
    "The orc didn't rage-quit. They just realized life's too short to deal with you.",
    "An orc survived war, famine, and plague—then met you and finally gave up.",
    "Congratulations, you've annoyed a creature bred for battle into giving his 2 weeks. Imagine what you do to normal people."
  ]

  // Orc wizard sprite animations - each image is a sprite sheet
  const orcSprites = {
    idle: {
      spriteSheet: '/assets/characters/orc/Orc-Idle.png',
      frameCount: 6 // Assuming similar to knight - will adjust when we see dimensions
    },
    cast: {
      spriteSheet: '/assets/characters/orc/Orc-Attack01.png',
      frameCount: 6 // Assuming similar to knight - will adjust when we see dimensions
    },
    attack: {
      spriteSheet: '/assets/characters/orc/Orc-Attack02.png',
      frameCount: 6 // Assuming similar to knight - will adjust when we see dimensions
    },
    walk: {
      spriteSheet: '/assets/characters/orc/Orc-Walk.png',
      frameCount: 8 // Assuming similar to knight - will adjust when we see dimensions
    }
  }

  useEffect(() => {
    if (isActive) {
      setIsAnimating(true)
      setAnimationType('cast')
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setAnimationType('idle')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive, message])

  const handleOrcClick = () => {
    if (hasLeft) return // Don't respond if orc has left
    
    setAnimationType('cast')
    setIsAnimating(true)
    
    // Cycle through messages
    setClickCount(prev => {
      const newCount = prev + 1
      
      // Check if orc should leave at 100 clicks
      if (newCount >= 100) {
        console.log('🟢 Starting orc leave sequence (100 clicks)...')
        
        // Select a random final message
        const randomMessage = finalMessages[Math.floor(Math.random() * finalMessages.length)]
        setFinalMessage(randomMessage)
        
        // Clear the current message immediately
        console.log('🟡 Clearing speech bubble text...')
        if (onMessageChange) {
          onMessageChange("")
        }
        
        // Hide speech bubble
        console.log('🟡 Hiding speech bubble...')
        setSpeechBubbleVisible(false)
        
        // Play monster scream 1 second before walking animation
        console.log('👹 Playing monster scream...')
        if (monsterScreamAudio) {
          monsterScreamAudio.currentTime = 15 // Start at 15 seconds
          monsterScreamAudio.play().catch(console.error)
          
          // Stop the monster scream after 3 seconds
          setTimeout(() => {
            if (monsterScreamAudio) {
              monsterScreamAudio.pause()
              monsterScreamAudio.currentTime = 15
            }
          }, 3000) // Stop after 3 seconds
        }
        
        // After speech bubble fades, start walking animation
        setTimeout(() => {
          console.log('🟠 Starting walking animation...')
          setIsWalkingAway(true)
          setAnimationType('walk')
          setIsAnimating(true)
          setWalkCycleCount(0)
          
          // Play steps sound
          if (stepsAudio) {
            stepsAudio.currentTime = 0
            stepsAudio.play().catch(console.error)
          }
          
          // Track walk cycles (8 frames per cycle, 312.5ms per frame = 5s total for 2 cycles)
          const walkInterval = setInterval(() => {
            setWalkCycleCount(prev => {
              const newCycleCount = prev + 1
              console.log(`🟣 Walk cycle: ${newCycleCount}/16`)
              
              // Fade steps volume from 0.6 to 0.3 over 16 frames
              if (stepsAudio) {
                const progress = newCycleCount / 16 // 0 to 1
                const volume = 0.6 - (progress * 0.3) // 0.6 to 0.3
                stepsAudio.volume = Math.max(0.3, volume) // Ensure minimum of 0.3
                console.log(`🔊 Steps volume: ${stepsAudio.volume.toFixed(2)}`)
              }
              
              // After 2 complete cycles (16 frames total), finish walking
              if (newCycleCount >= 16) {
                console.log('🔴 Finishing walk animation...')
                clearInterval(walkInterval)
                setIsWalkingAway(false)
                setHasFinishedWalking(true)
                setIsAnimating(false)
                // Stop the steps sound
                if (stepsAudio) {
                  stepsAudio.pause()
                  stepsAudio.currentTime = 0
                }
                // Delay setting hasLeft to true to allow orc to walk off-screen
                setTimeout(() => {
                  setHasLeft(true)
                  console.log('✅ Orc has left!')
                }, 1000) // Wait 1 second for orc to walk off-screen
              }
              return newCycleCount
            })
          }, 312.5) // 312.5ms per frame to match 5s total duration
        }, 500) // Wait 500ms for speech bubble to fade
        
        return newCount
      }
      
      // Progressive message phases
      let newMessage = ""
      
      if (newCount <= 12) {
        // Phase 1: Pure tips (0-12 clicks)
        newMessage = tips[newCount % tips.length]
      } else if (newCount <= 30) {
        // Phase 2: Mixed tips and mild insults (13-30 clicks)
        const phase2Count = newCount - 12
        if (phase2Count % 3 === 0) {
          // Every 3rd click is an insult
          newMessage = mildInsults[Math.floor(phase2Count / 3) % mildInsults.length]
        } else {
          // Others are tips
          newMessage = tips[phase2Count % tips.length]
        }
      } else if (newCount <= 60) {
        // Phase 3: More insults, fewer tips (31-60 clicks)
        const phase3Count = newCount - 30
        if (phase3Count % 2 === 0) {
          // Every 2nd click is an insult
          newMessage = mildInsults[Math.floor(phase3Count / 2) % mildInsults.length]
        } else {
          // Others are tips
          newMessage = tips[phase3Count % tips.length]
        }
      } else {
        // Phase 4: Pure extreme insults (61-99 clicks)
        const phase4Count = newCount - 60
        newMessage = extremeInsults[phase4Count % extremeInsults.length]
      }
      
      if (onMessageChange) {
        onMessageChange(newMessage)
      }
      
      return newCount
    })
    
    const timer = setTimeout(() => {
      if (!hasLeft) {
        setAnimationType('idle')
        setIsAnimating(false)
      }
    }, 3000) // Same as initial appearance animation
    return () => clearTimeout(timer)
  }

  // No early return - we'll handle the transition within the main container

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1
      }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      className="medieval-card p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Magical Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-wizard-100 to-purple-100 opacity-40"></div>
      
      {/* Replacement text when orc has left */}
      {hasLeft && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onAnimationStart={() => {
            // Play door slam sound when achievement text starts appearing
            console.log('🚪 Playing door slam sound...')
            if (doorSlamAudio) {
              doorSlamAudio.currentTime = 1 // Start at 1 second mark
              doorSlamAudio.play().catch(console.error)
            }
          }}
          className="relative z-10 text-center text-gray-600 w-full"
        >
          <p className="text-4xl font-medium mb-4"> 💨</p>
          <p className="text-xl font-semibold mb-3">Achievement unlocked: Absolute Menace. Please seek help.</p>
          <p className="text-base text-gray-500 max-w-md mx-auto">
            {finalMessage}
          </p>
        </motion.div>
      )}
      
      {/* Debug Controls */}
      {showDebug && (
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <button
            onClick={resetOrc}
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
            title="Reset Orc"
          >
            Reset
          </button>
          <button
            onClick={makeOrcLeave}
            disabled={hasLeft || isWalkingAway}
            className={`text-white text-xs px-2 py-1 rounded ${
              hasLeft || isWalkingAway
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title="Make Orc Leave"
          >
            Leave
          </button>
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Clicks: {clickCount} | Left: {hasLeft ? 'Yes' : 'No'} | Walking: {isWalkingAway ? 'Yes' : 'No'} | Finished: {hasFinishedWalking ? 'Yes' : 'No'} | Anim: {animationType}
          </div>
        </div>
      )}
      
      {/* Orc Wizard Avatar - show when orc hasn't left */}
      {!hasLeft && (
        <div className="relative z-10 flex items-center space-x-3 sm:space-x-6">
        <motion.div
          animate={{ 
            y: (isAnimating && !isWalkingAway) ? [-4, 4, -4] : 0,
            rotate: (isAnimating && !isWalkingAway) ? [-3, 3, -3] : 0,
            x: (isWalkingAway || hasFinishedWalking || hasLeft) ? 800 : 0
          }}
          transition={{ 
            duration: isWalkingAway ? 5 : 1, // 5s for walking animation to match stone steps
            repeat: (isAnimating && !isWalkingAway) ? 2 : 0,
            ease: isWalkingAway ? "linear" : "easeInOut"
          }}
          className="flex-shrink-0"
        >
          <div className="relative">
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center cursor-pointer"
              animate={{
                scale: animationType === 'cast' ? [1, 1.1, 1] : 1,
                rotate: animationType === 'cast' ? [0, 5, -5, 0] : 0
              }}
              transition={{
                duration: 0.8,
                repeat: animationType === 'cast' ? 3 : 0,
                ease: "easeInOut"
              }}
              onClick={handleOrcClick}
            >
              <SpriteAnimation
                spriteSheet={
                  animationType === 'cast' ? orcSprites.cast.spriteSheet :
                  animationType === 'walk' ? orcSprites.walk.spriteSheet :
                  orcSprites.idle.spriteSheet
                }
                frameCount={
                  animationType === 'cast' ? orcSprites.cast.frameCount :
                  animationType === 'walk' ? orcSprites.walk.frameCount :
                  orcSprites.idle.frameCount
                }
                frameRate={animationType === 'cast' ? 8 : animationType === 'walk' ? 5 : 3}
                loop={animationType === 'cast' || animationType === 'walk'}
                className="w-full h-full"
              />
            </motion.div>
            {/* Magical effects around wizard */}
            {isAnimating && !isWalkingAway && (
              <>
                <motion.div
                  animate={{ 
                    y: [0, -25, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 1.5, repeat: 2 }}
                  className="absolute -top-3 -right-3 text-purple-400 text-xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ duration: 1.5, repeat: 2, delay: 0.2 }}
                  className="absolute -top-2 -left-3 text-blue-400 text-lg"
                >
                  ⭐
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, -18, 0],
                    opacity: [0, 1, 0],
                    scale: [0.6, 1.1, 0.6]
                  }}
                  transition={{ duration: 1.5, repeat: 2, delay: 0.4 }}
                  className="absolute -top-1 left-1/2 text-yellow-400 text-sm"
                >
                  💫
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Speech Bubble */}
        {speechBubbleVisible && (
          <motion.div 
            className="flex-1 min-w-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: speechBubbleVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/90 rounded-lg p-3 sm:p-4 shadow-lg relative">
              {/* Speech bubble tail */}
              <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                <div className="w-0 h-0 border-t-6 border-b-6 border-r-6 sm:border-t-8 sm:border-b-8 sm:border-r-8 border-transparent border-r-white"></div>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 text-wizard-600 flex-shrink-0" />
                <span className="font-bold text-wizard-800 font-medieval text-sm sm:text-base">Orc Wizard Guide</span>
              </div>
              
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-wizard-700 text-sm sm:text-lg"
              >
                {message}
              </motion.p>
            </div>
          </motion.div>
        )}

      </div>
      )}

    </motion.div>
  )
}
