'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioOptions {
  volume?: number
  loop?: boolean
  autoplay?: boolean
}

export function useAudio(src: string, options: AudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('Creating audio for:', src)
    const audio = new Audio()
    audio.volume = options.volume ?? 0.5
    audio.loop = options.loop ?? false
    audio.preload = 'auto'
    audio.src = src

    const handleLoadedData = () => {
      console.log('Audio loaded:', src)
      setIsLoaded(true)
    }
    const handleCanPlay = () => {
      console.log('Audio can play:', src)
      setIsLoaded(true)
    }
    const handlePlay = () => {
      console.log('Audio playing:', src)
      setIsPlaying(true)
    }
    const handlePause = () => {
      console.log('Audio paused:', src)
      setIsPlaying(false)
    }
    const handleEnded = () => {
      console.log('Audio ended:', src)
      setIsPlaying(false)
    }
    const handleError = (e: any) => {
      console.error('Audio error:', src, e)
      setIsLoaded(false)
      setIsPlaying(false)
    }

    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    audioRef.current = audio

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
    }
  }, [src]) // Only depend on src, not options

  const play = async () => {
    if (audioRef.current) {
      try {
        console.log('Attempting to play:', src, 'loaded:', isLoaded, 'readyState:', audioRef.current.readyState)
        
        // Wait for audio to be ready if not loaded yet
        if (!isLoaded && audioRef.current.readyState < 2) {
          console.log('Audio not ready, waiting...', src)
          // Wait up to 5 seconds for audio to load
          let attempts = 0
          while (!isLoaded && audioRef.current.readyState < 2 && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
          }
        }
        
        if (audioRef.current && (isLoaded || audioRef.current.readyState >= 2)) {
          // Only pause if currently playing
          if (!audioRef.current.paused) {
            audioRef.current.pause()
          }
          audioRef.current.currentTime = 0
          
          // Set volume before playing
          audioRef.current.volume = options.volume ?? 0.5
          console.log('Playing audio:', src, 'volume:', audioRef.current.volume, 'readyState:', audioRef.current.readyState)
          
          await audioRef.current.play()
        } else {
          console.log('Audio still not ready to play:', src, 'loaded:', isLoaded, 'readyState:', audioRef.current?.readyState)
        }
      } catch (error) {
        console.log('Audio play failed:', error)
      }
    } else {
      console.log('No audio ref available:', src)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume))
    }
  }

  const fadeOut = (duration: number = 4000) => {
    if (audioRef.current) {
      const startVolume = audioRef.current.volume
      const startTime = Date.now()
      
      const fade = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const newVolume = startVolume * (1 - progress)
        
        if (audioRef.current) {
          audioRef.current.volume = newVolume
          
          if (progress < 1) {
            requestAnimationFrame(fade)
          } else {
            audioRef.current.pause()
            audioRef.current.volume = startVolume // Reset volume for next play
          }
        }
      }
      
      requestAnimationFrame(fade)
    }
  }

  const fadeIn = (duration: number = 2000) => {
    if (audioRef.current) {
      const targetVolume = options.volume ?? 0.5
      const startTime = Date.now()
      
      const fade = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const newVolume = targetVolume * progress
        
        if (audioRef.current) {
          audioRef.current.volume = newVolume
          
          if (progress < 1) {
            requestAnimationFrame(fade)
          }
        }
      }
      
      requestAnimationFrame(fade)
    }
  }

  return {
    play,
    pause,
    stop,
    setVolume,
    fadeOut,
    fadeIn,
    isPlaying,
    isLoaded
  }
}