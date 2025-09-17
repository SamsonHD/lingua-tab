import React, { useEffect } from "react";
import { motion } from "motion/react";
import { WordEntry } from "./LanguageManager";
import { speakWord } from "../utils/tts";

interface WordDisplayProps {
  word: WordEntry;
  size: number;
  selectedLanguage: string;
  isDailyWord?: boolean;
  onWordClick?: (speakFunction: () => Promise<void>) => void;
}

export const WordDisplay = ({
  word,
  size,
  selectedLanguage,
  isDailyWord = false,
  onWordClick,
}: WordDisplayProps) => {
  const containerSize = size * 0.6; // 60% of canvas size
  const maxWordLength = 60;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleSpeak = async () => {
    // Map display name to language code for Web Speech API
    const languageMap: Record<string, any> = {
      Spanish: 'es',
      French: 'fr',
      German: 'de',
      Italian: 'it',
      Japanese: 'ja',
      Portuguese: 'pt',
      Ukrainian: 'uk',
    };
    const code = languageMap[selectedLanguage] || 'en';
    
    // Extract only the first word (before any transliteration or additional info)
    // This handles cases like "こんにちは (konnichiwa)" or "привіт (privit)"
    const firstWord = word.word.split(/[\s(]/)[0].trim();
    
    try {
      await speakWord(firstWord, code as any, { rate: 0.8 });
    } catch (e) {
      // Silent fail to avoid interfering with UX
      console.warn('Speech synthesis failed:', e);
    }
  };

  // Provide the handleSpeak function to parent component
  useEffect(() => {
    if (onWordClick) {
      onWordClick(handleSpeak);
    }
  }, [selectedLanguage, word.word, onWordClick]); // Re-run when language or word changes

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        width: size,
        height: size,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex flex-col items-center justify-center text-center pointer-events-auto"
        style={{
          maxWidth: containerSize,
          maxHeight: containerSize,
          padding: "2rem",
        }}
      >
        {/* Daily Word Badge */}
        {isDailyWord && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500/40 to-blue-500/40 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-xs text-white/90 font-medium">
                ✨ Today's Word
              </span>
            </div>
          </motion.div>
        )}

        {/* Main Word */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white mb-4 break-words text-center"
          style={{
            fontSize: word.word.length > 15 ? "2.5rem" : "3rem",
            lineHeight: 1.2,
            fontFamily: "var(--font-heading)",
          }}
        >
          {truncateText(word.word, 20)}
        </motion.h1>

        {/* Meaning */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/90 mb-6 break-words text-center"
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.4,
            maxWidth: "90%",
          }}
        >
          {truncateText(word.meaning, maxWordLength)}
        </motion.p>

        {/* Example */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/70 italic text-center break-words"
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.3,
            maxWidth: "85%",
          }}
        >
          "{truncateText(word.example, maxWordLength)}"
        </motion.p>


        {/* Speaker Button - Bottom of Circle */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleSpeak}
          aria-label="Play pronunciation"
          className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
        >
          {/* simple speaker glyph */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10v4h4l5 5V5L7 10H3z" fill="currentColor"/>
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06A4.495 4.495 0 0016.5 12z" fill="currentColor"/>
            <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
          </svg>
        </motion.button>

        {/* Language Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <div className="px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-xs text-white/70 font-medium uppercase tracking-wide">
              {selectedLanguage}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};