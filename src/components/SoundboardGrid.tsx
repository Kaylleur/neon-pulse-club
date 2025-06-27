
import React from 'react';
import { SoundPad } from './SoundPad';
import { useAudio } from '../contexts/AudioContext';

export const SoundboardGrid = () => {
  const { playSound, isPlaying } = useAudio();
  
  // Sample pad configurations (you can expand this with real sound files)
  const soundPads = [
    { id: 1, label: 'KICK', icon: '🥁', key: '1', sound: 'kick.wav' },
    { id: 2, label: 'SNARE', icon: '🎯', key: '2', sound: 'snare.wav' },
    { id: 3, label: 'HIHAT', icon: '⚡', key: '3', sound: 'hihat.wav' },
    { id: 4, label: 'SYNTH', icon: '🎹', key: '4', sound: 'synth.wav' },
    { id: 5, label: 'BASS', icon: '🎸', key: '5', sound: 'bass.wav' },
    { id: 6, label: 'LEAD', icon: '✨', key: '6', sound: 'lead.wav' },
    { id: 7, label: 'PLUCK', icon: '🎵', key: '7', sound: 'pluck.wav' },
    { id: 8, label: 'PAD', icon: '🌊', key: '8', sound: 'pad.wav' },
    { id: 9, label: 'FX', icon: '💫', key: '9', sound: 'fx.wav' },
    { id: 10, label: 'VOCAL', icon: '🎤', key: 'A', sound: 'vocal.wav' },
    { id: 11, label: 'RISER', icon: '📈', key: 'B', sound: 'riser.wav' },
    { id: 12, label: 'DROP', icon: '💥', key: 'C', sound: 'drop.wav' }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h3 className="font-press-start text-2xl md:text-3xl mb-4 neon-text">
          SOUND MATRIX
        </h3>
        <p className="font-roboto text-white/70 text-sm md:text-base">
          Click pads or use keyboard shortcuts (1-9, A-C) to trigger sounds
        </p>
      </div>
      
      <div className="soundboard-grid">
        {soundPads.map((pad) => (
          <SoundPad
            key={pad.id}
            id={pad.id}
            label={pad.label}
            icon={pad.icon}
            keyboardKey={pad.key}
            sound={pad.sound}
            isPlaying={isPlaying(pad.id)}
            onPlay={() => playSound(pad.id, pad.sound)}
          />
        ))}
      </div>
    </div>
  );
};
</rov-write>

<lov-write file_path="src/components/SoundPad.tsx">
import React, { useEffect } from 'react';

interface SoundPadProps {
  id: number;
  label: string;
  icon: string;
  keyboardKey: string;
  sound: string;
  isPlaying: boolean;
  onPlay: () => void;
}

export const SoundPad: React.FC<SoundPadProps> = ({
  id,
  label,
  icon,
  keyboardKey,
  sound,
  isPlaying,
  onPlay
}) => {
  // Keyboard event handling
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === keyboardKey.toLowerCase()) {
        onPlay();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keyboardKey, onPlay]);

  return (
    <div
      className={`sound-pad ${isPlaying ? 'playing' : ''}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay();
        }
      }}
    >
      <div className="text-4xl md:text-5xl mb-2">
        {icon}
      </div>
      <div className="font-press-start text-xs md:text-sm text-synthwave-teal mb-1">
        {label}
      </div>
      <div className="font-roboto text-xs text-white/60">
        [{keyboardKey}]
      </div>
      
      {/* Visual feedback for playing state */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-lg bg-synthwave-pink/20 animate-pulse" />
      )}
    </div>
  );
};
