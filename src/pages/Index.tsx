
import React from 'react';
import { SoundboardHero } from '../components/SoundboardHero';
import { SoundboardGrid } from '../components/SoundboardGrid';
import { BackgroundPlayer } from '../components/BackgroundPlayer';
import { AudioProvider } from '../contexts/AudioContext';

const Index = () => {
  return (
    <AudioProvider>
      <div className="synthwave-container">
        {/* Animated grid background */}
        <div className="grid-background" />
        
        {/* Hero section */}
        <SoundboardHero />
        
        {/* Main soundboard */}
        <SoundboardGrid />
        
        {/* Background music player */}
        <BackgroundPlayer />
      </div>
    </AudioProvider>
  );
};

export default Index;
