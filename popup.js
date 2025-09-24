// Design System Switch Toggle Function
function toggleSwitch(switchId) {
  const checkbox = document.getElementById(switchId);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    checkbox.dispatchEvent(new Event('change'));
  }
}

// Setup Design System Switch Handlers
function setupSwitchHandlers() {
  // Make switch containers clickable
  document.querySelectorAll('.switch-container').forEach(container => {
    container.addEventListener('click', function(e) {
      // Don't trigger if clicking on the switch itself (to avoid double-firing)
      if (!e.target.closest('.switch')) {
        const checkbox = this.querySelector('.switch-input');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
    });
  });
  
  // Make individual switches clickable
  document.querySelectorAll('.switch').forEach(switchEl => {
    switchEl.addEventListener('click', function(e) {
      e.stopPropagation();
      const container = this.closest('.switch-container');
      const checkbox = container?.querySelector('.switch-input');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
      }
    });
  });
  
  // Make labels clickable
  document.querySelectorAll('.switch-label').forEach(label => {
    label.addEventListener('click', function(e) {
      e.stopPropagation();
      const switchId = this.getAttribute('for');
      if (switchId) {
        toggleSwitch(switchId);
      }
    });
  });
}

// Setup Design System Dropdown Handlers - Based on our React Dropdown component
function setupDropdownHandlers() {
  const dropdownContainer = document.getElementById('languageDropdown');
  const dropdownButton = dropdownContainer.querySelector('.design-dropdown-button');
  const dropdownContent = dropdownContainer.querySelector('.design-dropdown-content');
  const chevron = dropdownContainer.querySelector('.design-dropdown-chevron');
  
  if (!dropdownContainer || !dropdownButton || !dropdownContent) return;
  
  // Toggle dropdown on button click
  dropdownButton.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = dropdownContent.classList.contains('show');
    
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });
  
  // Handle option selection
  dropdownContent.addEventListener('click', function(e) {
    const option = e.target.closest('.design-dropdown-option');
    if (option && !option.classList.contains('disabled')) {
      const value = option.dataset.value;
      const icon = option.dataset.icon;
      const label = option.dataset.label;
      
      // Update selected display
      const selectedIcon = document.getElementById('selectedFlag');
      const selectedLabel = document.getElementById('selectedLanguage');
      selectedIcon.textContent = icon;
      selectedLabel.textContent = label;
      
      // Update selection state
      dropdownContent.querySelectorAll('.design-dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
      
      // Close dropdown
      closeDropdown();
      
      // Trigger change event for compatibility with existing code
      const changeEvent = new CustomEvent('change', { 
        detail: { value, icon, label },
        bubbles: true 
      });
      dropdownContainer.dispatchEvent(changeEvent);
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!dropdownContainer.contains(e.target)) {
      closeDropdown();
    }
  });
  
  // Keyboard navigation - matches React Dropdown component behavior
  dropdownButton.addEventListener('keydown', function(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        const isOpen = dropdownContent.classList.contains('show');
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!dropdownContent.classList.contains('show')) {
          openDropdown();
        } else {
          // Navigate to next option
          const options = Array.from(dropdownContent.querySelectorAll('.design-dropdown-option'));
          const currentIndex = options.findIndex(opt => opt.classList.contains('selected'));
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          selectOption(options[nextIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!dropdownContent.classList.contains('show')) {
          openDropdown();
        } else {
          // Navigate to previous option
          const options = Array.from(dropdownContent.querySelectorAll('.design-dropdown-option'));
          const currentIndex = options.findIndex(opt => opt.classList.contains('selected'));
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          selectOption(options[prevIndex]);
        }
        break;
    }
  });
  
  function openDropdown() {
    dropdownContent.classList.add('show');
    chevron.classList.add('rotated');
    dropdownButton.setAttribute('aria-expanded', 'true');
  }
  
  function closeDropdown() {
    dropdownContent.classList.remove('show');
    chevron.classList.remove('rotated');
    dropdownButton.setAttribute('aria-expanded', 'false');
  }
  
  function selectOption(option) {
    if (option && !option.classList.contains('disabled')) {
      const value = option.dataset.value;
      const icon = option.dataset.icon;
      const label = option.dataset.label;
      
      // Update selected display
      const selectedIcon = document.getElementById('selectedFlag');
      const selectedLabel = document.getElementById('selectedLanguage');
      selectedIcon.textContent = icon;
      selectedLabel.textContent = label;
      
      // Update selection state
      dropdownContent.querySelectorAll('.design-dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
      
      // Close dropdown
      closeDropdown();
      
      // Trigger change event
      const changeEvent = new CustomEvent('change', { 
        detail: { value, icon, label },
        bubbles: true 
      });
      dropdownContainer.dispatchEvent(changeEvent);
    }
  }
}

// Popup script for Chrome extension settings
document.addEventListener('DOMContentLoaded', async function() {
  const languageDropdown = document.getElementById('languageDropdown');
  const selectedFlag = document.getElementById('selectedFlag');
  const selectedLanguage = document.getElementById('selectedLanguage');
  const pauseAnimationCheckbox = document.getElementById('pauseAnimation');
  const hideAnimationCheckbox = document.getElementById('hideAnimation');
  const showFuriganaCheckbox = document.getElementById('showFurigana');
  let currentLanguage = 'pt'; // Default
  
  
  // Setup switch click handlers
  setupSwitchHandlers();
  
  // Setup dropdown functionality
  setupDropdownHandlers();
  
  // Add keyboard accessibility for switches
  document.querySelectorAll('.switch').forEach(switchEl => {
    switchEl.setAttribute('tabindex', '0');
    switchEl.setAttribute('role', 'switch');
    
    switchEl.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const container = this.closest('.switch-container');
        const checkbox = container?.querySelector('.switch-input');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
    });
  });
  
  // Load saved preferences
  chrome.storage.sync.get(['selectedLanguage', 'pauseAnimation', 'hideAnimation', 'showFurigana'], function(result) {
    if (result.selectedLanguage) {
      currentLanguage = result.selectedLanguage;
      // Update dropdown display
      updateDropdownDisplay(result.selectedLanguage);
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
  languageDropdown.addEventListener('change', async function(e) {
    const selectedLanguage = e.detail.value;
    const previousLanguage = currentLanguage;
    
    chrome.storage.sync.set({
      selectedLanguage: selectedLanguage
    }, function() {
      console.log('Language preference saved:', selectedLanguage);
    });
    
    currentLanguage = selectedLanguage;
  });
  
  // Helper function to update dropdown display
  function updateDropdownDisplay(languageCode) {
    const option = document.querySelector(`[data-value="${languageCode}"]`);
    if (option) {
      const icon = option.dataset.icon;
      const label = option.dataset.label;
      
      selectedFlag.textContent = icon;
      selectedLanguage.textContent = label;
      
      // Update selection state
      document.querySelectorAll('.design-dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
    }
  }
  
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
