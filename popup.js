// Popup script for Chrome extension settings
document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language');
  
  // Load saved language preference
  chrome.storage.sync.get(['selectedLanguage'], function(result) {
    if (result.selectedLanguage) {
      languageSelect.value = result.selectedLanguage;
    }
  });
  
  // Save language preference when changed
  languageSelect.addEventListener('change', function() {
    const selectedLanguage = languageSelect.value;
    chrome.storage.sync.set({
      selectedLanguage: selectedLanguage
    }, function() {
      console.log('Language preference saved:', selectedLanguage);
    });
  });
});
