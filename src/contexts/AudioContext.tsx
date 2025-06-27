
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AudioContextType {
  playSound: (id: number, soundFile: string) => void;
  isPlaying: (id: number) => boolean;
  backgroundVolume: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playingSounds, setPlayingSounds] = useState<Set<number>>(new Set());
  const [backgroundVolume, setBackgroundVolume] = useState(1.0);
  const audioRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Create or get audio element for a sound pad
  const getAudioElement = useCallback((id: number, soundFile: string) => {
    if (!audioRefs.current.has(id)) {
      const audio = new Audio();
      audio.preload = 'auto';
      // For demo purposes, we'll use a placeholder sound
      // In real implementation, you'd load from `/sounds/${soundFile}`
      console.log(`Loading sound: ${soundFile} for pad ${id}`);
      
      audio.addEventListener('ended', () => {
        setPlayingSounds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      });

      audioRefs.current.set(id, audio);
    }
    return audioRefs.current.get(id)!;
  }, []);

  // Play sound with ducking effect on background music
  const playSound = useCallback((id: number, soundFile: string) => {
    const audio = getAudioElement(id, soundFile);
    
    // If already playing, stop and restart
    if (playingSounds.has(id)) {
      audio.pause();
      audio.currentTime = 0;
      setPlayingSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      return;
    }

    // Duck background music
    setBackgroundVolume(0.3);
    
    // Clear existing fade timeout
    if (fadeTimeout.current) {
      clearTimeout(fadeTimeout.current);
    }

    // Play the sound
    try {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn('Audio play failed:', error);
        // Create a brief beep as fallback for demo
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(800 + (id * 100), context.currentTime);
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
      });

      setPlayingSounds(prev => new Set([...prev, id]));

      // Restore background volume after 500ms of silence
      fadeTimeout.current = setTimeout(() => {
        setBackgroundVolume(1.0);
      }, 500);

    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [getAudioElement, playingSounds]);

  const isPlaying = useCallback((id: number) => {
    return playingSounds.has(id);
  }, [playingSounds]);

  const value: AudioContextType = {
    playSound,
    isPlaying,
    backgroundVolume
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
