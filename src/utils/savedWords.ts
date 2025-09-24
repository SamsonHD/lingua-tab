import { WordEntry } from "../components/LanguageManager";

// Chrome API type declaration
declare const chrome: any;

export interface SavedWordItem extends WordEntry {
  languageCode: string;
  languageName: string;
  savedAt: string; // ISO date string
}

export interface SavedWordsStorage {
  savedWords: SavedWordItem[];
}

// Storage helper functions
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
      localStorage.setItem(key, JSON.stringify(value));
    });
    return Promise.resolve();
  }
};

// Save a word to the saved list
export const saveWord = async (word: WordEntry, languageCode: string, languageName: string): Promise<boolean> => {
  try {
    const data = await getStorageData(['savedWords']);
    const savedWords: SavedWordItem[] = data.savedWords || [];
    
    // Check if word already exists (dedupe by word + languageCode)
    const existingIndex = savedWords.findIndex(
      item => item.word === word.word && item.languageCode === languageCode
    );
    
    if (existingIndex !== -1) {
      // Word already exists, update the saved date
      savedWords[existingIndex].savedAt = new Date().toISOString();
    } else {
      // Add new word
      const savedWord: SavedWordItem = {
        ...word,
        languageCode,
        languageName,
        savedAt: new Date().toISOString()
      };
      savedWords.unshift(savedWord); // Add to beginning of array
    }
    
    await setStorageData({ savedWords });
    return true;
  } catch (error) {
    console.error('Error saving word:', error);
    return false;
  }
};

// Remove a word from the saved list
export const removeWord = async (word: string, languageCode: string): Promise<boolean> => {
  try {
    const data = await getStorageData(['savedWords']);
    const savedWords: SavedWordItem[] = data.savedWords || [];
    
    const filteredWords = savedWords.filter(
      item => !(item.word === word && item.languageCode === languageCode)
    );
    
    await setStorageData({ savedWords: filteredWords });
    return true;
  } catch (error) {
    console.error('Error removing word:', error);
    return false;
  }
};

// Get all saved words
export const getSavedWords = async (): Promise<SavedWordItem[]> => {
  try {
    const data = await getStorageData(['savedWords']);
    return data.savedWords || [];
  } catch (error) {
    console.error('Error getting saved words:', error);
    return [];
  }
};

// Check if a word is saved
export const isWordSaved = async (word: string, languageCode: string): Promise<boolean> => {
  try {
    const savedWords = await getSavedWords();
    return savedWords.some(item => item.word === word && item.languageCode === languageCode);
  } catch (error) {
    console.error('Error checking if word is saved:', error);
    return false;
  }
};

// Clear all saved words
export const clearAllSavedWords = async (): Promise<boolean> => {
  try {
    await setStorageData({ savedWords: [] });
    return true;
  } catch (error) {
    console.error('Error clearing saved words:', error);
    return false;
  }
};

// Export saved words as JSON
export const exportSavedWords = async (): Promise<string> => {
  try {
    const savedWords = await getSavedWords();
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalWords: savedWords.length,
      savedWords: savedWords
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting saved words:', error);
    return '{}';
  }
};

// Filter saved words by language
export const filterSavedWordsByLanguage = (savedWords: SavedWordItem[], languageCode?: string): SavedWordItem[] => {
  if (!languageCode) return savedWords;
  return savedWords.filter(word => word.languageCode === languageCode);
};

// Search saved words
export const searchSavedWords = (savedWords: SavedWordItem[], query: string): SavedWordItem[] => {
  if (!query.trim()) return savedWords;
  
  const lowercaseQuery = query.toLowerCase();
  return savedWords.filter(word => 
    word.word.toLowerCase().includes(lowercaseQuery) ||
    word.meaning.toLowerCase().includes(lowercaseQuery) ||
    word.example.toLowerCase().includes(lowercaseQuery) ||
    word.languageName.toLowerCase().includes(lowercaseQuery)
  );
};

// Import saved words from JSON data
export const importSavedWords = async (jsonData: string): Promise<{ success: boolean; importedCount: number; errors: string[] }> => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate the data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON format');
    }
    
    // Handle different possible data structures
    let wordsToImport: SavedWordItem[] = [];
    
    if (Array.isArray(data)) {
      // Direct array of words
      wordsToImport = data;
    } else if (data.savedWords && Array.isArray(data.savedWords)) {
      // Object with savedWords property
      wordsToImport = data.savedWords;
    } else if (data.words && Array.isArray(data.words)) {
      // Object with words property
      wordsToImport = data.words;
    } else {
      throw new Error('No valid word data found in file');
    }
    
    // Validate each word item
    const errors: string[] = [];
    const validWords: SavedWordItem[] = [];
    
    wordsToImport.forEach((word: any, index: number) => {
      try {
        // Check required fields
        if (!word.word || !word.meaning || !word.example) {
          errors.push(`Word ${index + 1}: Missing required fields (word, meaning, or example)`);
          return;
        }
        
        // Create a valid SavedWordItem
        const validWord: SavedWordItem = {
          word: String(word.word).trim(),
          meaning: String(word.meaning).trim(),
          example: String(word.example).trim(),
          languageCode: word.languageCode || 'en',
          languageName: word.languageName || 'English',
          savedAt: word.savedAt || new Date().toISOString()
        };
        
        validWords.push(validWord);
      } catch (error) {
        errors.push(`Word ${index + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`);
      }
    });
    
    if (validWords.length === 0) {
      throw new Error('No valid words found to import');
    }
    
    // Get existing saved words
    const existingWords = await getSavedWords();
    
    // Merge with existing words (avoid duplicates based on word + languageCode)
    const existingKeys = new Set(existingWords.map(w => `${w.word}-${w.languageCode}`));
    const newWords = validWords.filter(w => !existingKeys.has(`${w.word}-${w.languageCode}`));
    
    // Combine existing and new words
    const allWords = [...existingWords, ...newWords];
    
    // Save to storage
    await setStorageData({ savedWords: allWords });
    
    return {
      success: true,
      importedCount: newWords.length,
      errors: errors
    };
    
  } catch (error) {
    console.error('Error importing saved words:', error);
    return {
      success: false,
      importedCount: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error occurred']
    };
  }
};
