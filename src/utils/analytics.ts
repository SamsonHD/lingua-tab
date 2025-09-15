// Google Analytics 4 Measurement Protocol for Chrome Extensions
// Documentation: https://developers.google.com/analytics/devguides/collection/protocol/ga4

const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const MEASUREMENT_ID = 'G-64Q1NV4Y9N';
const API_SECRET = '89N4ydjcTHyAERF_Py-rBw';
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;
const SESSION_EXPIRATION_IN_MIN = 30;

/**
 * Generate or retrieve a unique client ID for this browser/user
 * The client ID persists as long as the extension is installed
 */
async function getOrCreateClientId(): Promise<string> {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    // Fallback for development environment
    let clientId = localStorage.getItem('ga_client_id');
    if (!clientId) {
      clientId = crypto.randomUUID();
      localStorage.setItem('ga_client_id', clientId);
    }
    return clientId;
  }

  const result = await chrome.storage.local.get('ga_client_id');
  let clientId = result.ga_client_id;
  if (!clientId) {
    // Generate a unique client ID using Web Crypto API
    clientId = self.crypto.randomUUID();
    await chrome.storage.local.set({ ga_client_id: clientId });
  }
  return clientId;
}

/**
 * Generate or retrieve a session ID
 * Sessions expire after 30 minutes of inactivity
 */
async function getOrCreateSessionId(): Promise<string> {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    // Fallback for development environment
    const sessionData = JSON.parse(localStorage.getItem('ga_session_data') || 'null');
    const currentTimeInMs = Date.now();
    
    if (sessionData && sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
      if (durationInMin <= SESSION_EXPIRATION_IN_MIN) {
        // Update timestamp to keep session alive
        const updatedSessionData = {
          ...sessionData,
          timestamp: currentTimeInMs
        };
        localStorage.setItem('ga_session_data', JSON.stringify(updatedSessionData));
        return sessionData.session_id;
      }
    }
    
    // Create new session
    const newSessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs
    };
    localStorage.setItem('ga_session_data', JSON.stringify(newSessionData));
    return newSessionData.session_id;
  }

  // Use chrome.storage.session for extension environment
  let { ga_session_data: sessionData } = await chrome.storage.session.get('ga_session_data');
  const currentTimeInMs = Date.now();

  // Check if session exists and is still valid
  if (sessionData && sessionData.timestamp) {
    const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      sessionData = null;
    } else {
      // Update timestamp to keep session alive
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.session.set({ ga_session_data: sessionData });
    }
  }

  if (!sessionData) {
    // Create and store a new session
    sessionData = {
      session_id: currentTimeInMs.toString(),
      timestamp: currentTimeInMs
    };
    await chrome.storage.session.set({ ga_session_data: sessionData });
  }

  return sessionData.session_id;
}

/**
 * Send an event to Google Analytics
 */
async function sendAnalyticsEvent(eventName: string, parameters: Record<string, any> = {}): Promise<void> {
  try {
    const clientId = await getOrCreateClientId();
    const sessionId = await getOrCreateSessionId();

    const payload = {
      client_id: clientId,
      events: [
        {
          name: eventName,
          params: {
            session_id: sessionId,
            engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
            ...parameters
          }
        }
      ]
    };

    const response = await fetch(
      `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      console.warn('Analytics event failed:', response.status);
    }
  } catch (error) {
    // Silently fail analytics to not disrupt user experience
    console.warn('Analytics error:', error);
  }
}

/**
 * Track page view events
 */
export async function trackPageView(pageTitle: string, pageLocation: string): Promise<void> {
  await sendAnalyticsEvent('page_view', {
    page_title: pageTitle,
    page_location: pageLocation
  });
}

/**
 * Track language selection events
 */
export async function trackLanguageChange(fromLanguage: string, toLanguage: string): Promise<void> {
  await sendAnalyticsEvent('language_changed', {
    from_language: fromLanguage,
    to_language: toLanguage
  });
}

/**
 * Track shader selection events
 */
export async function trackShaderChange(shaderId: number): Promise<void> {
  await sendAnalyticsEvent('shader_changed', {
    shader_id: shaderId
  });
}

/**
 * Track daily word views
 */
export async function trackDailyWordView(language: string, word: string): Promise<void> {
  await sendAnalyticsEvent('daily_word_viewed', {
    language: language,
    word_length: word.length,
    // Don't send the actual word for privacy
    word_hash: await hashString(word)
  });
}

/**
 * Track extension installation/first use
 */
export async function trackExtensionInstalled(): Promise<void> {
  await sendAnalyticsEvent('extension_installed', {
    version: '1.0.1'
  });
}

/**
 * Track popup interactions
 */
export async function trackPopupOpened(): Promise<void> {
  await sendAnalyticsEvent('popup_opened');
}

/**
 * Track errors for debugging
 */
export async function trackError(errorMessage: string, errorStack?: string): Promise<void> {
  await sendAnalyticsEvent('extension_error', {
    error_message: errorMessage.substring(0, 100), // Limit length
    error_stack: errorStack ? errorStack.substring(0, 500) : undefined
  });
}

/**
 * Simple hash function for privacy-preserving word tracking
 */
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
}
