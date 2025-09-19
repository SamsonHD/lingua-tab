// Toggle switch function for modern UI
function toggleSwitch(switchId) {
  const checkbox = document.getElementById(switchId);
  checkbox.checked = !checkbox.checked;
  checkbox.dispatchEvent(new Event('change'));
}

// Add click handlers to switches after DOM loads
function setupSwitchHandlers() {
  // Make the actual switch elements clickable too
  document.querySelectorAll('.switch').forEach(switchEl => {
    switchEl.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent double-firing from container click
      const container = this.closest('.switch-container');
      const switchId = container.querySelector('input').id;
      toggleSwitch(switchId);
    });
  });
  
  // Make labels clickable
  document.querySelectorAll('.switch-label').forEach(label => {
    label.addEventListener('click', function(e) {
      e.stopPropagation();
      const switchId = this.getAttribute('for');
      toggleSwitch(switchId);
    });
  });
}

// Popup script for Chrome extension settings
document.addEventListener('DOMContentLoaded', async function() {
  const languageSelect = document.getElementById('language');
  const pauseAnimationCheckbox = document.getElementById('pauseAnimation');
  const hideAnimationCheckbox = document.getElementById('hideAnimation');
  const showFuriganaCheckbox = document.getElementById('showFurigana');
  let currentLanguage = 'pt'; // Default
  
  
  // Setup switch click handlers
  setupSwitchHandlers();
  
  // Load saved preferences
  chrome.storage.sync.get(['selectedLanguage', 'pauseAnimation', 'hideAnimation', 'showFurigana'], function(result) {
    if (result.selectedLanguage) {
      languageSelect.value = result.selectedLanguage;
      currentLanguage = result.selectedLanguage;
    }
    
    if (result.pauseAnimation) {
      pauseAnimationCheckbox.checked = result.pauseAnimation;
    }
    
    if (result.hideAnimation) {
      hideAnimationCheckbox.checked = result.hideAnimation;
    }
    
    if (result.showFurigana) {
      showFuriganaCheckbox.checked = result.showFurigana;
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
    
    currentLanguage = selectedLanguage;
  });
  
  // Save animation pause preference when changed
  pauseAnimationCheckbox.addEventListener('change', function() {
    const pauseAnimation = pauseAnimationCheckbox.checked;
    
    chrome.storage.sync.set({
      pauseAnimation: pauseAnimation
    }, function() {
      console.log('Pause animation preference saved:', pauseAnimation);
    });
    
    // If hide animation is checked, uncheck it when pause is checked
    if (pauseAnimation && hideAnimationCheckbox.checked) {
      hideAnimationCheckbox.checked = false;
      chrome.storage.sync.set({ hideAnimation: false });
    }
  });
  
  // Save animation hide preference when changed
  hideAnimationCheckbox.addEventListener('change', function() {
    const hideAnimation = hideAnimationCheckbox.checked;
    
    chrome.storage.sync.set({
      hideAnimation: hideAnimation
    }, function() {
      console.log('Hide animation preference saved:', hideAnimation);
    });
    
    // If hide animation is checked, uncheck pause animation
    if (hideAnimation && pauseAnimationCheckbox.checked) {
      pauseAnimationCheckbox.checked = false;
      chrome.storage.sync.set({ pauseAnimation: false });
    }
  });
  
  // Save furigana preference when changed
  showFuriganaCheckbox.addEventListener('change', function() {
    const showFurigana = showFuriganaCheckbox.checked;
    
    chrome.storage.sync.set({
      showFurigana: showFurigana
    }, function() {
      console.log('Show furigana preference saved:', showFurigana);
    });
  });
});
