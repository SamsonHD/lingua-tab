// Frontend TTS utility using Web Speech API (built into browsers)

export type SupportedLangCode = 'es' | 'fr' | 'de' | 'it' | 'ja' | 'pt' | 'uk';

// Map our language codes to BCP-47 language tags for Web Speech API
const languageMap: Record<SupportedLangCode, string> = {
  es: 'es-ES',
  fr: 'fr-FR', 
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  pt: 'pt-PT',
  uk: 'uk-UA'
};

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export async function speakWord(text: string, lang: SupportedLangCode, options?: SpeechOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if Web Speech API is supported
    if (!('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported'));
      return;
    }

    // Wait for voices to be loaded (important for some browsers)
    const speakWithVoice = () => {
      const voices = speechSynthesis.getVoices();
      const targetLang = languageMap[lang];
      
      
      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find the best voice for the language
      const preferredVoice = voices.find(voice => 
        voice.lang === targetLang || 
        voice.lang.startsWith(targetLang.split('-')[0])
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Set language
      utterance.lang = targetLang || 'en-US';
      
      // Set speech options
      utterance.rate = options?.rate ?? 0.8; // Slightly slower for learning
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      // Handle events
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      // Speak the text
      speechSynthesis.speak(utterance);
    };

    // If voices are already loaded, speak immediately
    if (speechSynthesis.getVoices().length > 0) {
      speakWithVoice();
    } else {
      // Wait for voices to load with timeout
      let voicesLoaded = false;
      
      const onVoicesChanged = () => {
        if (!voicesLoaded) {
          voicesLoaded = true;
          speechSynthesis.onvoiceschanged = null;
          speakWithVoice();
        }
      };
      
      speechSynthesis.onvoiceschanged = onVoicesChanged;
      
      // Fallback timeout in case voices never load
      setTimeout(() => {
        if (!voicesLoaded) {
          voicesLoaded = true;
          speechSynthesis.onvoiceschanged = null;
          speakWithVoice();
        }
      }, 1000);
    }
  });
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function getAvailableVoices(lang?: SupportedLangCode): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  
  const voices = speechSynthesis.getVoices();
  
  if (lang) {
    const targetLang = languageMap[lang];
    return voices.filter(voice => voice.lang.startsWith(targetLang.split('-')[0]));
  }
  
  return voices;
}

