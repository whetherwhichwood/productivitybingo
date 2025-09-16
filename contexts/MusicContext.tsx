'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAudio } from '@/hooks/useAudio'

interface MusicContextType {
  playBackgroundMusic: () => void
  stopBackgroundMusic: () => void
  playTreasureMusic: () => void
  stopTreasureMusic: () => void
  playWizardMusic: () => void
  stopWizardMusic: () => void
  isBackgroundPlaying: boolean
  isTreasurePlaying: boolean
  isWizardPlaying: boolean
  setMasterVolume: (volume: number) => void
  stopAllMusic: () => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [masterVolume, setMasterVolume] = useState(0.7) // Default 70% volume
  const [currentBackgroundTrack, setCurrentBackgroundTrack] = useState(0)
  const [activeMusic, setActiveMusic] = useState<'background' | 'treasure' | 'wizard' | 'none'>('none')

  // Individual audio hooks - normalized volumes for consistent baseline
  const minstrelDance = useAudio('/music/minstrel_dance.mp3', { volume: masterVolume * 0.8, loop: true })
  const bardsTale = useAudio('/music/bards_tale.mp3', { volume: masterVolume * 0.9, loop: true })
  const bustlingVillage = useAudio('/music/bustling_village.mp3', { volume: masterVolume * 0.7, loop: true })
  const oldTower = useAudio('/music/old_tower.mp3', { volume: masterVolume * 0.8, loop: true })

  // Update volume when master volume changes
  useEffect(() => {
    minstrelDance.setVolume(masterVolume * 0.8)
    bardsTale.setVolume(masterVolume * 0.9)
    bustlingVillage.setVolume(masterVolume * 0.7)
    oldTower.setVolume(masterVolume * 0.8)
  }, [masterVolume]) // Only depend on masterVolume

  // Track cycling timer - switch between background tracks every 2.5 minutes
  useEffect(() => {
    if (activeMusic === 'background') {
      const cycleInterval = setInterval(() => {
        console.log('Cycling background music with fade transition')
        const nextTrack = currentBackgroundTrack === 0 ? 1 : 0
        setCurrentBackgroundTrack(nextTrack)
        
        // Fade out current track over 4 seconds, then fade in next track over 2 seconds
        if (currentBackgroundTrack === 0) {
          minstrelDance.fadeOut(4000) // 4 second fade out
          setTimeout(() => {
            bardsTale.play()
            bardsTale.fadeIn(2000) // 2 second fade in
          }, 4000) // Wait for fade out to complete
        } else {
          bardsTale.fadeOut(4000) // 4 second fade out
          setTimeout(() => {
            minstrelDance.play()
            minstrelDance.fadeIn(2000) // 2 second fade in
          }, 4000) // Wait for fade out to complete
        }
      }, 150000) // 2.5 minutes (150000ms)
      
      return () => clearInterval(cycleInterval)
    }
  }, [activeMusic, currentBackgroundTrack]) // Removed audio hook dependencies

  const playBackgroundMusic = () => {
    console.log('playBackgroundMusic called, currentTrack:', currentBackgroundTrack, 'current activeMusic:', activeMusic)
    
    // Only play if not already playing background music
    if (activeMusic === 'background') {
      console.log('Background music already active, skipping')
      return
    }
    
    // Stop all music first
    minstrelDance.stop()
    bardsTale.stop()
    bustlingVillage.stop()
    oldTower.stop()
    
    // Set active music state
    setActiveMusic('background')
    
    // Small delay to ensure stops complete
    setTimeout(() => {
      // Play current background track with fade in
      if (currentBackgroundTrack === 0) {
        console.log('Playing Minstrel Dance with fade in')
        minstrelDance.play()
        minstrelDance.fadeIn(2000)
      } else {
        console.log('Playing Bards Tale with fade in')
        bardsTale.play()
        bardsTale.fadeIn(2000)
      }
    }, 200)
  }

  const stopBackgroundMusic = () => {
    minstrelDance.stop()
    bardsTale.stop()
    setActiveMusic('none')
  }

  const playTreasureMusic = () => {
    console.log('playTreasureMusic called, current activeMusic:', activeMusic)
    
    // Only play if not already playing treasure music
    if (activeMusic === 'treasure') {
      console.log('Treasure music already active, skipping')
      return
    }
    
    // Stop all music first
    minstrelDance.stop()
    bardsTale.stop()
    bustlingVillage.stop()
    oldTower.stop()
    
    // Set active music state
    setActiveMusic('treasure')
    
    // Small delay to ensure stops complete
    setTimeout(() => {
      console.log('Starting Bustling Village music')
      bustlingVillage.play()
    }, 200)
  }

  const stopTreasureMusic = () => {
    bustlingVillage.stop()
    setActiveMusic('none')
  }

  const playWizardMusic = () => {
    console.log('playWizardMusic called, current activeMusic:', activeMusic)
    
    // Only play if not already playing wizard music
    if (activeMusic === 'wizard') {
      console.log('Wizard music already active, skipping')
      return
    }
    
    // Stop all music first
    minstrelDance.stop()
    bardsTale.stop()
    bustlingVillage.stop()
    oldTower.stop()
    
    // Set active music state
    setActiveMusic('wizard')
    
    // Small delay to ensure stops complete
    setTimeout(() => {
      console.log('Starting Old Tower music')
      oldTower.play()
    }, 200)
  }

  const stopWizardMusic = () => {
    oldTower.stop()
    setActiveMusic('none')
    
    // Resume background music after wizard closes
    setTimeout(() => {
      console.log('Wizard closed, resuming background music')
      playBackgroundMusic()
    }, 500)
  }

  // Force stop all music
  const stopAllMusic = () => {
    minstrelDance.stop()
    bardsTale.stop()
    bustlingVillage.stop()
    oldTower.stop()
    setActiveMusic('none')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      minstrelDance.stop()
      bardsTale.stop()
      bustlingVillage.stop()
      oldTower.stop()
    }
  }, []) // Empty dependency array for cleanup only

  const value: MusicContextType = {
    playBackgroundMusic,
    stopBackgroundMusic,
    playTreasureMusic,
    stopTreasureMusic,
    playWizardMusic,
    stopWizardMusic,
    isBackgroundPlaying: minstrelDance.isPlaying || bardsTale.isPlaying,
    isTreasurePlaying: bustlingVillage.isPlaying,
    isWizardPlaying: oldTower.isPlaying,
    setMasterVolume,
    stopAllMusic
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}