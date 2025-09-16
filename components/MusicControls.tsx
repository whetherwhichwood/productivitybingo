'use client'

import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { useMusic } from '@/contexts/MusicContext'

export default function MusicControls() {
  const { setMasterVolume } = useMusic()
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(70)

  // Initialize volume on mount
  useEffect(() => {
    setMasterVolume(0.7)
  }, [setMasterVolume])

  const handleVolumeChange = (newVolume: number) => {
    // Round to nearest 10% increment
    const steppedVolume = Math.round(newVolume / 10) * 10
    setVolume(steppedVolume)
    setMasterVolume(steppedVolume / 100)
    setIsMuted(steppedVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(30) // 30% when unmuting
    } else {
      handleVolumeChange(0) // 0% when muting
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-40">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-gray-500" />
            ) : (
              <Volume2 className="h-4 w-4 text-gray-600" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
          <span className="text-xs text-gray-500 w-8">{volume}%</span>
        </div>
        
      </div>
    </div>
  )
}
