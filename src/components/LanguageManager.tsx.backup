import { useState, useEffect } from "react";
import { trackLanguageChange, trackExtensionInstalled } from "../utils/analytics";
// Allow TypeScript to compile in both web and extension contexts
// without depending on @types/chrome in the app bundle
declare const chrome: any;

export interface WordEntry {
  word: string;
  meaning: string;
  example: string;
  pronunciation?: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  words: WordEntry[];
}

// Language entries are loaded from JSON dictionaries at runtime.
const languageData: Language[] = [];

const dictionaryIndex: Array<{ code: string; name: string; flag: string; file: string }> = [
  { code: "pt", name: "Portuguese", flag: "🇵🇹", file: "portuguese.json" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦", file: "ukrainian.json" },
  { code: "es", name: "Spanish", flag: "🇪🇸", file: "spanish.json" },
  { code: "fr", name: "French", flag: "🇫🇷", file: "french.json" },
  { code: "de", name: "German", flag: "🇩🇪", file: "german.json" },
  { code: "it", name: "Italian", flag: "🇮🇹", file: "italian.json" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", file: "japanese.json" }
];

export const useLanguageManager = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null as Language | null);
  const [dailyWord, setDailyWord] = useState(null as WordEntry | null);
  const [isLoading, setIsLoading] = useState(true);

  // Chrome extension storage helper
  const getStorageData = (keys: string[]): Promise<any> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(keys, resolve);
      });
    } else {
      // Fallback to localStorage for development
      const result: any = {};
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) result[key] = value;
      });
      return Promise.resolve(result);
    }
  };

  const setStorageData = (data: any): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.set(data, resolve);
      });
    } else {
      // Fallback to localStorage for development
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      return Promise.resolve();
    }
  };

  // Get daily word (changes once per day)
  const calculateDailyWord = (language: Language): WordEntry => {
    const today = new Date().toDateString();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const dailyIndex = dayOfYear % language.words.length;
    return language.words[dailyIndex];
  };

  // Change language
  const changeLanguage = async (language: Language) => {
    const previousLanguage = selectedLanguage?.name || 'unknown';
    
    setSelectedLanguage(language);
    const newDailyWord = calculateDailyWord(language);
    setDailyWord(newDailyWord);
    
    await setStorageData({
      selectedLanguage: language.code,
      dailyWordDate: new Date().toDateString()
    });
    
    // Track language change
    trackLanguageChange(previousLanguage, language.name);
  };

  // Initialize from storage and load dictionaries
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        const data = await getStorageData(['selectedLanguage', 'dailyWordDate']);

        // Load all dictionaries
        const loadOne = async (entry: { code: string; name: string; flag: string; file: string }): Promise<Language> => {
          // Support both dev (Vite) and extension runtime URLs
          const basePath = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
            ? chrome.runtime.getURL('dictionaries/')
            : '/src/dictionaries/';
          const url = basePath + entry.file;
          const res = await fetch(url);
          const json = await res.json();
          return {
            code: entry.code,
            name: entry.name,
            flag: entry.flag,
            words: json.words as WordEntry[]
          };
        };

        const loadedLanguages = await Promise.all(dictionaryIndex.map(loadOne));
        // Replace languages array reference while keeping type
        (languageData as Language[]).splice(0, languageData.length, ...loadedLanguages);
        
        // Load selected language
        let currentLanguage = languageData[0]; // default to first loaded (Spanish)
        if (data.selectedLanguage) {
          const savedLanguage = languageData.find(lang => lang.code === data.selectedLanguage);
          if (savedLanguage) {
            currentLanguage = savedLanguage;
          }
        }
        
        setSelectedLanguage(currentLanguage);
        
        // Calculate daily word
        const todaysDailyWord = calculateDailyWord(currentLanguage);
        setDailyWord(todaysDailyWord);
        
        // Update storage with today's date if needed
        const today = new Date().toDateString();
        if (data.dailyWordDate !== today) {
          await setStorageData({
            selectedLanguage: currentLanguage.code,
            dailyWordDate: today
          });
        }
        
        // Track installation on first use (when no previous data exists)
        if (!data.selectedLanguage && !data.dailyWordDate) {
          trackExtensionInstalled();
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        // Use defaults if there's an error
        const defaultWord = calculateDailyWord(languageData[0]);
        setDailyWord(defaultWord);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Listen for language changes from popup
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const handleStorageChange = (changes: any) => {
        if (changes.selectedLanguage && changes.selectedLanguage.newValue !== selectedLanguage.code) {
          const newLanguage = languageData.find(lang => lang.code === changes.selectedLanguage.newValue);
          if (newLanguage) {
            setSelectedLanguage(newLanguage);
            setDailyWord(calculateDailyWord(newLanguage));
          }
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, [selectedLanguage]);

  return {
    languages: languageData,
    selectedLanguage: selectedLanguage || languageData[0] || { code: 'pt', name: 'Portuguese', flag: '🇵🇹', words: [] },
    dailyWord: dailyWord || { word: '', meaning: '', example: '' },
    changeLanguage,
    isLoading
  };
};