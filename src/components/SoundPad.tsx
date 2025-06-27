
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
