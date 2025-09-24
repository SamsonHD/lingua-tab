import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SavedWordItem, getSavedWords, removeWord, clearAllSavedWords, exportSavedWords, importSavedWords, filterSavedWordsByLanguage, searchSavedWords } from "../utils/savedWords";
import { speakWord } from "../utils/tts";
import { useResponsiveFont } from "../utils/responsiveFonts";
import { PrimaryButton, DestructiveButton, SecondaryButton, Dropdown, SearchInput, type DropdownOption } from "./ui";

// Chrome API type declaration
declare const chrome: any;

interface SavedWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Array<{ code: string; name: string; flag: string }>;
}

export const SavedWordsModal = ({ isOpen, onClose, languages }: SavedWordsModalProps) => {
  const [savedWords, setSavedWords] = useState([] as SavedWordItem[]);
  const [filteredWords, setFilteredWords] = useState([] as SavedWordItem[]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Responsive font sizes (ensuring minimum 10px)
  const titleFontSize = useResponsiveFont({ base: 1.5, scale: 0.9, minScale: 0.7, maxScale: 1.2 });
  const wordFontSize = useResponsiveFont({ base: 1.2, scale: 0.9, minScale: 0.8, maxScale: 1.1 });
  const meaningFontSize = useResponsiveFont({ base: 0.9, scale: 0.9, minScale: 0.8, maxScale: 1.0 });
  const exampleFontSize = useResponsiveFont({ base: 0.85, scale: 0.9, minScale: 0.8, maxScale: 0.95 });
  const dateFontSize = useResponsiveFont({ base: 0.8, scale: 0.9, minScale: 0.8, maxScale: 0.9 });

  // Load saved words when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSavedWords();
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Filter words when search query or language filter changes
  useEffect(() => {
    let filtered = savedWords;
    
    if (selectedLanguage) {
      filtered = filterSavedWordsByLanguage(filtered, selectedLanguage);
    }
    
    if (searchQuery.trim()) {
      filtered = searchSavedWords(filtered, searchQuery);
    }
    
    setFilteredWords(filtered);
  }, [savedWords, selectedLanguage, searchQuery]);

  const loadSavedWords = async () => {
    setIsLoading(true);
    try {
      const words = await getSavedWords();
      setSavedWords(words);
    } catch (error) {
      console.error('Error loading saved words:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveWord = async (word: string, languageCode: string) => {
    try {
      const success = await removeWord(word, languageCode);
      if (success) {
        await loadSavedWords(); // Reload the list
      }
    } catch (error) {
      console.error('Error removing word:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all saved words? This action cannot be undone.')) {
      return;
    }
    
    setIsClearing(true);
    try {
      const success = await clearAllSavedWords();
      if (success) {
        setSavedWords([]);
        setFilteredWords([]);
      }
    } catch (error) {
      console.error('Error clearing saved words:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const jsonData = await exportSavedWords();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saved-words-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting saved words:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    console.log('Starting import process for file:', file.name);
    setIsImporting(true);
    try {
      const text = await file.text();
      console.log('File content loaded, length:', text.length);
      const result = await importSavedWords(text);
      console.log('Import result:', result);
      
      if (result.success) {
        // Reload the saved words to show the imported ones
        await loadSavedWords();
        
        // Show success message
        const message = result.importedCount > 0 
          ? `Successfully imported ${result.importedCount} words!`
          : 'No new words to import (all words already exist).';
        alert(message);
        
        // Show warnings if there were errors
        if (result.errors.length > 0) {
          console.warn('Import warnings:', result.errors);
          alert(`Import completed with ${result.errors.length} warnings. Check console for details.`);
        }
      } else {
        alert(`Import failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error importing saved words:', error);
      alert('Failed to import file. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileInputChange = (event: any) => {
    console.log('File input changed:', event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name, file.type, file.size);
      handleImport(file);
    } else {
      console.log('No file selected');
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  const handleSpeakWord = async (word: SavedWordItem) => {
    try {
      const languageMap: Record<string, any> = {
        Spanish: 'es',
        French: 'fr',
        German: 'de',
        Italian: 'it',
        Japanese: 'ja',
        Portuguese: 'pt',
        Ukrainian: 'uk',
      };
      const code = languageMap[word.languageName] || 'en';
      
      // Extract only the first word (before any transliteration or additional info)
      const firstWord = word.word.split(/[\s(]/)[0].trim();
      
      await speakWord(firstWord, code as any, { rate: 0.8 });
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl flex flex-col"
          style={{ width: 'min(92vw, 720px)', maxHeight: 'calc(100vh - 2rem)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 
                className="text-white font-semibold"
                style={{ 
                  fontSize: `${titleFontSize}rem`,
                  fontFamily: "var(--font-body)"
                }}
              >
                Saved Words ({filteredWords.length})
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors touch-manipulation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-white">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row md:gap-6 lg:gap-8 gap-4">
              {/* Search */}
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search words, meanings, or examples..."
                  variant="secondary"
                  size="md"
                  fullWidth
                />
              </div>
              
              {/* Language Filter */}
              <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
                <Dropdown
                  options={[
                    { value: "", label: "All Languages" },
                    ...languages.map((lang) => ({
                      value: lang.code,
                      label: lang.name,
                      icon: lang.flag
                    }))
                  ]}
                  value={selectedLanguage}
                  onSelect={setSelectedLanguage}
                  placeholder="All Languages"
                  variant="secondary"
                  size="md"
                  fullWidth
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6 mt-4">
              <PrimaryButton
                onClick={handleExport}
                disabled={isExporting || filteredWords.length === 0}
                isLoading={isExporting}
                loadingText="Exporting..."
                size="sm"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                }
              >
                Export JSON
              </PrimaryButton>
              
              {/* Import Button */}
              <div className="relative">
                <input
                  ref={(input) => {
                    if (input) {
                      (window as any).importFileInput = input;
                    }
                  }}
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={isImporting}
                />
                <PrimaryButton
                  disabled={isImporting}
                  isLoading={isImporting}
                  loadingText="Importing..."
                  size="sm"
                  onClick={() => {
                    console.log('Import button clicked');
                    const input = (window as any).importFileInput;
                    if (input) {
                      input.click();
                    }
                  }}
                  icon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17,8 12,3 7,8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  }
                >
                  Import JSON
                </PrimaryButton>
              </div>
              
              <DestructiveButton
                onClick={handleClearAll}
                disabled={isClearing || filteredWords.length === 0}
                isLoading={isClearing}
                loadingText="Clearing..."
                size="sm"
                icon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Clear All
              </DestructiveButton>
            </div>
          </div>

          {/* Content */}
          <div 
            className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 min-h-0 rounded-b-xl saved-words-modal-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white/60" style={{ fontFamily: "var(--font-body)" }}>Loading saved words...</div>
              </div>
            ) : filteredWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
                <div className="text-white/50 mb-6 text-base sm:text-lg" style={{ fontFamily: "var(--font-body)" }}>
                  {savedWords.length === 0 
                    ? "No saved words yet. Click the star button on any word to save it!"
                    : "No words match your search criteria."
                  }
                </div>
                {savedWords.length > 0 && (
                  <SecondaryButton
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLanguage("");
                    }}
                    size="md"
                  >
                    Clear Filters
                  </SecondaryButton>
                )}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredWords.map((word, index) => (
                  <motion.div
                    key={`${word.word}-${word.languageCode}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-200 hover:border-white/20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Word and Language */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 
                            className="text-white font-bold tracking-tight"
                            style={{ 
                              fontSize: `${wordFontSize}rem`,
                              fontFamily: "var(--font-body)"
                            }}
                          >
                            {word.word}
                          </h3>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/15 rounded-md w-fit border border-white/10">
                            <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>
                              {languages.find(l => l.code === word.languageCode)?.flag}
                            </span>
                            <span className="text-xs text-white/80 uppercase font-semibold tracking-wide" style={{ fontFamily: "var(--font-body)" }}>
                              {word.languageCode}
                            </span>
                          </div>
                        </div>
                        
                        {/* Meaning */}
                        <div className="mb-2">
                          <p 
                            className="text-white/90 leading-snug font-medium"
                            style={{ 
                              fontSize: `${meaningFontSize}rem`,
                              fontFamily: "var(--font-body)"
                            }}
                          >
                            {word.meaning}
                          </p>
                        </div>
                        
                        {/* Example */}
                        <div className="mb-2">
                          <p 
                            className="text-white/75 italic leading-snug"
                            style={{ 
                              fontSize: `${exampleFontSize}rem`,
                              fontFamily: "var(--font-body)"
                            }}
                          >
                            "{word.example}"
                          </p>
                        </div>
                        
                        {/* Date */}
                        <div 
                          className="text-white/40 font-medium"
                          style={{ 
                            fontSize: `${dateFontSize}rem`,
                            fontFamily: "var(--font-body)"
                          }}
                        >
                          Saved on {formatDate(word.savedAt)}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 sm:ml-4 md:ml-6">
                        <button
                          onClick={() => handleSpeakWord(word)}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                          title="Listen to pronunciation"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-white/70">
                            <path d="M3 10v4h4l5 5V5L7 10H3z" />
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06A4.495 4.495 0 0016.5 12z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleRemoveWord(word.word, word.languageCode)}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
                          title="Remove from saved words"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-red-400">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
