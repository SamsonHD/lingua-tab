import React, { useState, useEffect } from "react";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { ShaderSelector } from "./components/ShaderSelector";
import { LanguageSelector } from "./components/LanguageSelector";
import { WordDisplay } from "./components/WordDisplay";
import { TimeGreeting } from "./components/TimeGreeting";
import { SavedWordsModal } from "./components/SavedWordsModal";
import { useLanguageManager } from "./components/LanguageManager";
import { motion } from "motion/react";
import { useResponsiveFont } from "./utils/responsiveFonts";

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
  const [userSelectedShader, setUserSelectedShader] = useState(1); // Store user's actual shader choice
  const [speakFunction, setSpeakFunction] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const [hideAnimation, setHideAnimation] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);
  const [isCircleHovered, setIsCircleHovered] = useState(false);
  const [isSavedWordsModalOpen, setIsSavedWordsModalOpen] = useState(false);
  
  // Responsive font size for daily word info
  const infoFontSize = useResponsiveFont({ base: 0.875, scale: 0.95, minScale: 0.6, maxScale: 1.0 });
  
  // Responsive font size for buttons (matching language selector)
  const buttonFontSize = useResponsiveFont({ base: 1, scale: 0.95, minScale: 0.7, maxScale: 1.0 });

  // Set dark mode and update page title
  useEffect(() => {
    document.documentElement.classList.add("dark");
    if (dailyWord && selectedLanguage) {
      document.title = `${dailyWord.word} - LinguaTab`;
      
    }
  }, [dailyWord, selectedLanguage]);

  // Adjust canvas size based on window size with responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // More aggressive scaling for smaller screens
      let scaleFactor = 0.8;
      if (viewportWidth <= 480) {
        scaleFactor = 0.6; // Smaller on very small screens
      } else if (viewportWidth <= 640) {
        scaleFactor = 0.7; // Medium-small screens
      } else if (viewportWidth <= 768) {
        scaleFactor = 0.75; // Tablets
      }
      
      const size = Math.min(viewportWidth, viewportHeight) * scaleFactor;
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
    setUserSelectedShader(id); // Store user's actual choice
    setSelectedShader(id); // Always apply the selected shader
    
    // If hide animation is currently ON and user selects a shader, turn it OFF
    if (hideAnimation) {
      setHideAnimation(false);
      // Update storage to reflect the change
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ hideAnimation: false });
      } else {
        localStorage.setItem("hideAnimation", "false");
      }
    }
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ selectedShader: id });
    } else {
      localStorage.setItem("selectedShader", id.toString());
    }
    
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

  // Load preferences from storage
  useEffect(() => {
    const loadPreferences = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['selectedShader', 'pauseAnimation', 'hideAnimation', 'showFurigana'], (result) => {
          if (result.selectedShader) {
            setUserSelectedShader(result.selectedShader);
            setSelectedShader(result.selectedShader);
          }
          if (result.pauseAnimation !== undefined) {
            setPauseAnimation(result.pauseAnimation);
          }
          if (result.hideAnimation !== undefined) {
            setHideAnimation(result.hideAnimation);
          }
          if (result.showFurigana !== undefined) {
            setShowFurigana(result.showFurigana);
          }
        });
      } else {
        const savedShader = localStorage.getItem("selectedShader");
        if (savedShader) {
          const shaderValue = parseInt(savedShader, 10);
          setUserSelectedShader(shaderValue);
          setSelectedShader(shaderValue);
        }
        const savedPauseAnimation = localStorage.getItem("pauseAnimation");
        if (savedPauseAnimation) {
          setPauseAnimation(savedPauseAnimation === 'true');
        }
        const savedHideAnimation = localStorage.getItem("hideAnimation");
        if (savedHideAnimation) {
          setHideAnimation(savedHideAnimation === 'true');
        }
      }
    };
    
    loadPreferences();
  }, []);

  // Handle hideAnimation shader switching
  useEffect(() => {
    if (hideAnimation) {
      // Switch to accessibility shader (ID 5) when hiding animation
      setSelectedShader(5);
    } else {
      // Restore user's selected shader when not hiding animation
      setSelectedShader(userSelectedShader);
    }
  }, [hideAnimation, userSelectedShader]);

  // Listen for storage changes from popup
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const handleStorageChange = (changes: any) => {
        if (changes.pauseAnimation && changes.pauseAnimation.newValue !== undefined) {
          setPauseAnimation(changes.pauseAnimation.newValue);
        }
        if (changes.hideAnimation && changes.hideAnimation.newValue !== undefined) {
          setHideAnimation(changes.hideAnimation.newValue);
        }
        if (changes.showFurigana && changes.showFurigana.newValue !== undefined) {
          setShowFurigana(changes.showFurigana.newValue);
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  // Responsive font size for loading text
  const loadingFontSize = useResponsiveFont({ base: 1.25, scale: 0.9, minScale: 0.7, maxScale: 1.1 });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white"
          style={{ fontSize: `${loadingFontSize}rem` }}
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

      {/* Language Selector and Settings - Top Left */}
      <div className="fixed top-6 left-6 z-20 flex items-center gap-3">
        {/* Settings Button */}
        <motion.button
          onClick={() => {
            if (typeof chrome !== 'undefined' && chrome.action) {
              chrome.action.openPopup();
            }
          }}
          className="flex items-center justify-center px-4 py-3 bg-black/30 backdrop-blur-sm rounded-full border border-white/10 hover:bg-black/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Open Settings"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </motion.button>
        
        <LanguageSelector
          languages={languages}
          selectedLanguage={selectedLanguage}
          onLanguageChange={changeLanguage}
        />

        {/* Saved Words Button */}
        <motion.button
          onClick={() => setIsSavedWordsModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-sm rounded-full border border-white/10 hover:bg-black/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="View Saved Words"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span 
            className="text-white font-medium"
            style={{ fontSize: `${buttonFontSize}rem` }}
          >
            Saved Words
          </span>
        </motion.button>
      </div>

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
          onMouseEnter={() => setIsCircleHovered(true)}
          onMouseLeave={() => setIsCircleHovered(false)}
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
            pauseAnimation={pauseAnimation}
          />

          {/* Daily Word Display in the center */}
          <WordDisplay
            word={dailyWord}
            size={canvasSize}
            selectedLanguage={selectedLanguage.name}
            selectedLanguageCode={selectedLanguage.code}
            isDailyWord={true}
            onWordClick={handleWordClick}
            showFurigana={showFurigana}
            isCircleHovered={isCircleHovered}
          />
        </motion.div>

        {/* Daily word info */}
      </div>

      {/* Saved Words Modal */}
      <SavedWordsModal
        isOpen={isSavedWordsModalOpen}
        onClose={() => setIsSavedWordsModalOpen(false)}
        languages={languages}
      />

    </div>
  );
}