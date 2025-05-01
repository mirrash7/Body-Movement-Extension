document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle');
  const controlsButton = document.getElementById('controls-button');
  const emojiToggleButton = document.getElementById('emoji-toggle');
  const controlsInfo = document.getElementById('controls-info');
  const statusElement = document.getElementById('status');
  
  // Check current state
  chrome.storage.local.get(['motionEnabled', 'emojiEnabled'], function(result) {
    if (result.motionEnabled) {
      toggleButton.textContent = 'Disable Motion Control';
      toggleButton.style.backgroundColor = '#f44336';
      statusElement.textContent = 'Motion control active';
      statusElement.style.backgroundColor = '#e8f5e9';
      statusElement.style.color = '#2e7d32';
    }
    
    if (result.emojiEnabled === false) {
      emojiToggleButton.textContent = 'Show Emoji';
    }
  });
  
  // Toggle motion control
  toggleButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const isEnabled = toggleButton.textContent.includes('Enable');
      
      chrome.storage.local.set({motionEnabled: isEnabled}, function() {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggle",
          enabled: isEnabled
        }, function(response) {
          console.log("Toggle response:", response);
          
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
            statusElement.textContent = 'Error: ' + chrome.runtime.lastError.message;
            statusElement.style.backgroundColor = '#ffebee';
            statusElement.style.color = '#c62828';
            return;
          }
          
          if (isEnabled) {
            toggleButton.textContent = 'Disable Motion Control';
            toggleButton.style.backgroundColor = '#f44336';
            statusElement.textContent = 'Motion control active';
            statusElement.style.backgroundColor = '#e8f5e9';
            statusElement.style.color = '#2e7d32';
          } else {
            toggleButton.textContent = 'Enable Motion Control';
            toggleButton.style.backgroundColor = '#4CAF50';
            statusElement.textContent = 'Motion control disabled';
            statusElement.style.backgroundColor = '#f0f0f0';
            statusElement.style.color = '#666';
          }
        });
      });
    });
  });
  
  // Toggle controls info
  controlsButton.addEventListener('click', function() {
    if (controlsInfo.style.display === 'block') {
      controlsInfo.style.display = 'none';
      controlsButton.textContent = 'Show Controls';
    } else {
      controlsInfo.style.display = 'block';
      controlsButton.textContent = 'Hide Controls';
    }
  });
  
  // Toggle emoji
  emojiToggleButton.addEventListener('click', function() {
    const showEmoji = emojiToggleButton.textContent.includes('Show');
    
    chrome.storage.local.set({emojiEnabled: showEmoji}, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleEmoji",
          enabled: showEmoji
        }, function(response) {
          console.log("Emoji toggle response:", response);
          
          if (showEmoji) {
            emojiToggleButton.textContent = 'Hide Emoji';
          } else {
            emojiToggleButton.textContent = 'Show Emoji';
          }
        });
      });
    });
  });
}); 