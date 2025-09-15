// Analytics for popup - uses regular JavaScript (not ES modules)
const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const MEASUREMENT_ID = 'G-64Q1NV4Y9N';
const API_SECRET = '89N4ydjcTHyAERF_Py-rBw';
const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;
const SESSION_EXPIRATION_IN_MIN = 30;

/**
 * Generate or retrieve a unique client ID for this browser/user
 */
async function getOrCreateClientId() {
  const result = await chrome.storage.local.get('ga_client_id');
  let clientId = result.ga_client_id;
  if (!clientId) {
    clientId = self.crypto.randomUUID();
    await chrome.storage.local.set({ ga_client_id: clientId });
  }
  return clientId;
}

/**
 * Generate or retrieve a session ID
 */
async function getOrCreateSessionId() {
  let { ga_session_data: sessionData } = await chrome.storage.session.get('ga_session_data');
  const currentTimeInMs = Date.now();

  if (sessionData && sessionData.timestamp) {
    const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;
    if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
      sessionData = null;
    } else {
      sessionData.timestamp = currentTimeInMs;
      await chrome.storage.session.set({ ga_session_data: sessionData });
    }
  }

  if (!sessionData) {
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
async function sendAnalyticsEvent(eventName, parameters = {}) {
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
    console.warn('Analytics error:', error);
  }
}

/**
 * Track popup page view
 */
async function trackPopupPageView() {
  await sendAnalyticsEvent('page_view', {
    page_title: document.title,
    page_location: document.location.href
  });
}

/**
 * Track popup opened event
 */
async function trackPopupOpened() {
  await sendAnalyticsEvent('popup_opened');
}

/**
 * Track language selection from popup
 */
async function trackPopupLanguageChange(fromLanguage, toLanguage) {
  await sendAnalyticsEvent('popup_language_changed', {
    from_language: fromLanguage,
    to_language: toLanguage
  });
}
