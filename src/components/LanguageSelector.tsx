import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Language } from "./LanguageManager";

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-3 bg-black/30 backdrop-blur-sm rounded-full border border-white/10 hover:bg-black/40 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">{selectedLanguage.flag}</span>
          <span className="text-white font-medium">{selectedLanguage.name}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-white/70" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden min-w-[200px] z-20"
              >
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      selectedLanguage.code === language.code
                        ? "bg-white/5 text-white"
                        : "text-white/80"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{language.name}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </div>
  );
};