import { motion } from "motion/react";
import { WordEntry } from "./LanguageManager";

interface WordDisplayProps {
  word: WordEntry;
  size: number;
  selectedLanguage: string;
  isDailyWord?: boolean;
}

export const WordDisplay = ({
  word,
  size,
  selectedLanguage,
  isDailyWord = false,
}: WordDisplayProps) => {
  const containerSize = size * 0.6; // 60% of canvas size
  const maxWordLength = 60;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

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
          className="text-white mb-4 break-words"
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