// Popup script for Chrome extension settings
document.addEventListener('DOMContentLoaded', async function() {
  const languageSelect = document.getElementById('language');
  let currentLanguage = 'pt'; // Default
  
  // Track popup opened
  await trackPopupOpened();
  await trackPopupPageView();
  
  // Load saved language preference
  chrome.storage.sync.get(['selectedLanguage'], function(result) {
    if (result.selectedLanguage) {
      languageSelect.value = result.selectedLanguage;
      currentLanguage = result.selectedLanguage;
    }
  });
  
  // Save language preference when changed
  languageSelect.addEventListener('change', async function() {
    const selectedLanguage = languageSelect.value;
    const previousLanguage = currentLanguage;
    
    chrome.storage.sync.set({
      selectedLanguage: selectedLanguage
    }, function() {
      console.log('Language preference saved:', selectedLanguage);
    });
    
    // Track language change
    await trackPopupLanguageChange(previousLanguage, selectedLanguage);
    currentLanguage = selectedLanguage;
  });
});
