
import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '../contexts/AudioContext';

export const BackgroundPlayer = () => {
  const { backgroundVolume } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const trackTitle = "Neon Dreams - Synthwave Mix";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = backgroundVolume;
    }
  }, [backgroundVolume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-player">
      <audio
        ref={audioRef}
        loop
        preload="metadata"
      >
        {/* You can add your background track source here */}
        <source src="/sounds/background-track.mp3" type="audio/mpeg" />
      </audio>
      
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-synthwave-pink hover:bg-synthwave-teal 
                   transition-colors duration-300 flex items-center justify-center
                   neon-border hover:scale-110 transform"
        >
          {isPlaying ? (
            <div className="w-3 h-3 bg-white rounded-sm" />
          ) : (
            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="font-press-start text-xs text-synthwave-teal mb-1 truncate">
            {trackTitle}
          </div>
          
          {/* Progress Bar */}
          <div 
            className="progress-bar cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="progress-fill"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex justify-between text-xs text-white/60 font-roboto mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-white/60 font-roboto">VOL</span>
          <div className="w-16 h-2 bg-synthwave-darkPurple rounded-full overflow-hidden border border-synthwave-pink">
            <div 
              className="h-full bg-gradient-to-r from-synthwave-pink to-synthwave-teal transition-all duration-300"
              style={{ width: `${backgroundVolume * 100}%` }}
            />
          </div>
          <span className="text-xs text-synthwave-teal font-roboto w-8">
            {Math.round(backgroundVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
