import React, { useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { ShaderSelector } from "./components/ShaderSelector";
import { LanguageSelector } from "./components/LanguageSelector";
import { WordDisplay } from "./components/WordDisplay";
import { TimeGreeting } from "./components/TimeGreeting";
import { useLanguageManager } from "./components/LanguageManager";
import { motion } from "motion/react";
import { trackPageView, trackDailyWordView, trackShaderChange, trackExtensionInstalled } from "./utils/analytics";

// Chrome API type declaration
declare const chrome: any;

export default function App() {
  const {
    languages,
    selectedLanguage,
    dailyWord,
    changeLanguage,
    isLoading
  } = useLanguageManager();

  const [canvasSize, setCanvasSize] = useState(600);
  const [selectedShader, setSelectedShader] = useState(1);
  const [speakFunction, setSpeakFunction] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());

  // Set dark mode and update page title
  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (dailyWord && selectedLanguage) {
      document.title = `${dailyWord.word} - LinguaTab`;
      
      // Track page view and daily word view
      trackPageView(document.title, document.location.href);
      trackDailyWordView(selectedLanguage.name, dailyWord.word);
    }
  }, [dailyWord, selectedLanguage]);

  // Adjust canvas size based on window size
  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
      setCanvasSize(size);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle shader selection
  const handleSelectShader = (id: number) => {
    setSelectedShader(id);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ selectedShader: id });
    } else {
      localStorage.setItem("selectedShader", id.toString());
    }
    
    // Track shader change
    trackShaderChange(id);
  };

  // Handle central area click to play word with rate limiting
  const handleCentralClick = async () => {
    if (!speakFunction) return;

    const now = Date.now();
    const timeSinceLastReset = now - lastResetTime;
    
    // Reset click count every 10 seconds
    if (timeSinceLastReset > 10000) {
      setClickCount(0);
      setLastResetTime(now);
    }
    
    // Limit to 5 clicks per 10 seconds
    if (clickCount >= 5) {
      console.log('Rate limit reached: Please wait before playing audio again');
      return;
    }
    
    // Prevent multiple simultaneous audio playbacks
    if (isPlaying) {
      return;
    }

    try {
      setIsPlaying(true);
      setClickCount(prev => prev + 1);
      await speakFunction();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  // Handle word click callback from WordDisplay
  const handleWordClick = (speakFn: () => Promise<void>) => {
    setSpeakFunction(() => speakFn);
  };

  // Load shader preference from storage
  useEffect(() => {
    const loadShaderPreference = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['selectedShader'], (result) => {
          if (result.selectedShader) {
            setSelectedShader(result.selectedShader);
          }
        });
      } else {
        const savedShader = localStorage.getItem("selectedShader");
        if (savedShader) {
          setSelectedShader(parseInt(savedShader, 10));
        }
      }
    };
    
    loadShaderPreference();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl"
        >
          Loading your daily word...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Time Greeting - Top Right */}
      <TimeGreeting />

      {/* Language Selector - Top Left */}
      <LanguageSelector
        languages={languages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
      />

      {/* Shader Selector - Right Side */}
      <ShaderSelector
        selectedShader={selectedShader}
        onSelectShader={handleSelectShader}
      />

      {/* Main layout container with shader */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Shader Circle */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`relative ${
            clickCount >= 5 || isPlaying 
              ? 'cursor-not-allowed opacity-75' 
              : 'cursor-pointer'
          }`}
          onClick={handleCentralClick}
          title={
            clickCount >= 5 
              ? 'Rate limited - please wait 10 seconds'
              : isPlaying 
              ? 'Playing audio...'
              : 'Click to hear pronunciation'
          }
        >
          <ShaderCanvas
            size={canvasSize}
            shaderId={selectedShader}
          />

          {/* Daily Word Display in the center */}
          <WordDisplay
            word={dailyWord}
            size={canvasSize}
            selectedLanguage={selectedLanguage.name}
            isDailyWord={true}
            onWordClick={handleWordClick}
          />
        </motion.div>

        {/* Daily word info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-white/40 text-sm">
            Your daily word in {selectedLanguage.name}
          </p>
          <p className="text-white/30 text-xs mt-1">
            A new word awaits you tomorrow!
          </p>
        </motion.div>
      </div>

    </div>
  );
}