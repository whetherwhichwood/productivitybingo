'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface SpriteAnimationProps {
  spriteSheet: string
  frameCount: number
  frameRate?: number
  loop?: boolean
  autoplay?: boolean
  className?: string
  onAnimationComplete?: () => void
}

export default function SpriteAnimation({
  spriteSheet,
  frameCount,
  frameRate = 8,
  loop = true,
  autoplay = true,
  className = '',
  onAnimationComplete
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!isPlaying || frameCount === 0) return

    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + 1
        if (nextFrame >= frameCount) {
          if (loop) {
            return 0
          } else {
            setIsPlaying(false)
            onAnimationComplete?.()
            return prevFrame
          }
        }
        return nextFrame
      })
    }, 1000 / frameRate)

    return () => clearInterval(interval)
  }, [isPlaying, frameCount, frameRate, loop, onAnimationComplete])

  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)
  const reset = () => {
    setCurrentFrame(0)
    setIsPlaying(autoplay)
  }

  if (!spriteSheet || frameCount === 0) return null

  // Fallback: If sprite sheet fails to load, show a simple image
  if (imageError) {
    return (
      <motion.div
        className={`relative ${className}`}
        animate={{
          scale: isPlaying ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: isPlaying ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <Image
          src={spriteSheet}
          alt="Character sprite"
          width={100}
          height={100}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        scale: isPlaying ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 0.5,
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundImage: `url(${spriteSheet})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `-${currentFrame * 100}px 0px`,
          backgroundSize: `${frameCount * 100}px 100px`,
          imageRendering: 'pixelated',
          transform: 'scale(4) translate(-12.5%, -12.5%)', // Scale and adjust position to center
          transformOrigin: 'center'
        }}
        onError={() => setImageError(true)}
      />
    </motion.div>
  )
}
