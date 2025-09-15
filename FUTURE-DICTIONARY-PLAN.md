# Future Dictionary Integration Plan

## Current Limitations
- Limited word database (currently ~25 words per language)
- Words are hardcoded in the LanguageManager component
- No ability to add new words without code changes
- No pronunciation guides or audio

## Proposed Dictionary Integration

### 1. Dictionary File Structure
```
dictionaries/
├── spanish.json
├── french.json
├── german.json
├── italian.json
└── portuguese.json
```

### 2. Enhanced Word Entry Format
```json
{
  "version": "1.0.0",
  "language": "Spanish",
  "languageCode": "es",
  "totalWords": 1000,
  "words": [
    {
      "id": 1,
      "word": "hola",
      "meaning": "hello, hi - a common greeting",
      "example": "¡Hola! ¿Cómo estás?",
      "pronunciation": "OH-lah",
      "audioUrl": "audio/es/hola.mp3",
      "difficulty": "beginner",
      "category": "greetings",
      "partOfSpeech": "interjection",
      "etymology": "From Latin 'salve'",
      "relatedWords": ["saludo", "saludar"],
      "tags": ["common", "daily-use"]
    }
  ]
}
```

### 3. Implementation Approaches

#### Option A: Static Dictionary Files (Recommended for Chrome Extension)
**Pros:**
- Works offline
- Fast loading
- No API dependencies
- Chrome Web Store friendly

**Cons:**
- Larger extension size
- Updates require extension updates
- Limited to pre-selected words

**Implementation:**
```javascript
// Load dictionary dynamically
const loadDictionary = async (languageCode) => {
  const response = await fetch(`/dictionaries/${languageCode}.json`);
  return response.json();
};
```

#### Option B: External API Integration
**Pros:**
- Unlimited vocabulary
- Regular updates
- Smaller extension size
- Rich metadata

**Cons:**
- Requires internet connection
- API costs
- Chrome extension permissions needed
- Potential rate limiting

**APIs to Consider:**
- Wordnik API
- Oxford Dictionary API
- Merriam-Webster API
- Free Dictionary API

#### Option C: Hybrid Approach (Best Long-term)
**Pros:**
- Best of both worlds
- Graceful fallback
- Progressive enhancement

**Implementation:**
- Core vocabulary (500-1000 words) bundled
- Extended vocabulary via API
- Cache API responses locally
- Fallback to bundled words when offline

### 4. Technical Implementation Plan

#### Phase 1: Dictionary File Structure
```javascript
// Enhanced LanguageManager
class DictionaryManager {
  constructor() {
    this.dictionaries = new Map();
    this.currentLanguage = 'es';
  }

  async loadDictionary(languageCode) {
    if (!this.dictionaries.has(languageCode)) {
      const dict = await fetch(`/dictionaries/${languageCode}.json`);
      this.dictionaries.set(languageCode, await dict.json());
    }
    return this.dictionaries.get(languageCode);
  }

  async getDailyWord(languageCode, date = new Date()) {
    const dictionary = await this.loadDictionary(languageCode);
    const dayOfYear = this.getDayOfYear(date);
    const wordIndex = dayOfYear % dictionary.totalWords;
    return dictionary.words[wordIndex];
  }
}
```

#### Phase 2: Enhanced Features
```javascript
// Word with audio support
const WordDisplay = ({ word }) => {
  const playPronunciation = () => {
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      audio.play();
    } else {
      // Fallback to text-to-speech
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = getLanguageCode(word.language);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <h1>{word.word}</h1>
      <button onClick={playPronunciation}>🔊</button>
      <p>{word.pronunciation}</p>
      <p>{word.meaning}</p>
      <p><em>"{word.example}"</em></p>
      <div className="metadata">
        <span className="difficulty">{word.difficulty}</span>
        <span className="category">{word.category}</span>
        <span className="part-of-speech">{word.partOfSpeech}</span>
      </div>
    </div>
  );
};
```

### 5. Data Sources for Dictionaries

#### Free Resources:
- **Wiktionary** - Comprehensive, multilingual
- **OpenTaal** - Dutch language resources
- **FreeDictionary API** - Basic definitions
- **Linguee** - Context examples

#### Premium Resources:
- **Oxford Dictionary API** - High quality, comprehensive
- **Merriam-Webster API** - American English focused
- **Cambridge Dictionary API** - Learner-focused
- **Wordnik API** - Large vocabulary with examples

### 6. Extension Size Considerations

#### Current Extension: ~350KB
#### With Dictionaries:
- 1000 words per language: ~2MB
- 5000 words per language: ~8MB
- Chrome extension limit: 128MB

#### Optimization Strategies:
- Compress JSON files
- Load dictionaries on-demand
- Use Web Workers for processing
- Implement smart caching

### 7. Update Strategy

#### Automatic Updates:
```javascript
// Check for dictionary updates
const checkForUpdates = async () => {
  const currentVersion = await getDictionaryVersion();
  const latestVersion = await fetch('/api/dictionary-version');
  
  if (currentVersion < latestVersion) {
    // Download and install new dictionaries
    await updateDictionaries();
  }
};
```

### 8. Implementation Timeline

#### Phase 1 (1-2 weeks):
- Create dictionary JSON files
- Refactor LanguageManager
- Implement file-based loading
- Test with larger vocabulary

#### Phase 2 (2-3 weeks):
- Add pronunciation support
- Implement difficulty levels
- Add word categories
- Enhanced UI for metadata

#### Phase 3 (3-4 weeks):
- API integration option
- Offline/online hybrid
- User progress tracking
- Custom word lists

### 9. Manifest Updates Needed

```json
{
  "permissions": [
    "storage",
    "activeTab"  // If API integration needed
  ],
  "web_accessible_resources": [
    {
      "resources": ["dictionaries/*.json", "audio/*.mp3"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

This plan provides a roadmap for scaling the extension from the current limited vocabulary to a comprehensive language learning tool.
