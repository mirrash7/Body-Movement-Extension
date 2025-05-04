// Flag to track if overlay is injected
let overlayInjected = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.action === "toggle") {
    if (message.enabled) {
      // Only inject overlay if not already injected
      if (!overlayInjected) {
        injectOverlay().then(() => {
          // Give the overlay time to initialize
          setTimeout(() => {
            console.log("Sending TOGGLE message to overlay");
            window.postMessage({
              type: "SUBWAY_TOGGLE",
              source: "extension",
              enabled: true
            }, "*");
          }, 1000); // Increased timeout to ensure overlay is ready
        }).catch(err => {
          console.error("Error injecting overlay:", err);
          sendResponse({status: "Error: " + err.message});
        });
      } else {
        // If already injected, just send the toggle message
        console.log("Overlay already injected, sending toggle message");
        window.postMessage({
          type: "SUBWAY_TOGGLE",
          source: "extension",
          enabled: true
        }, "*");
      }
    } else {
      // Disable overlay
      window.postMessage({
        type: "SUBWAY_TOGGLE",
        source: "extension",
        enabled: false
      }, "*");
    }
    
    sendResponse({status: "Motion control " + (message.enabled ? "enabled" : "disabled")});
  } 
  else if (message.action === "toggleEmoji") {
    window.postMessage({
      type: "SUBWAY_TOGGLE_EMOJI",
      source: "extension",
      enabled: message.enabled
    }, "*");
    sendResponse({status: "Emoji " + (message.enabled ? "enabled" : "disabled")});
  }
  
  return true;
});

// Listen for messages from the overlay script
window.addEventListener('message', (event) => {
  // Only process messages from our overlay
  if (event.data && event.data.source === 'subway_overlay') {
    console.log("Content script received message from overlay:", event.data);
    
    // Update storage with current state
    if (event.data.type === 'STATUS_UPDATE') {
      chrome.storage.local.set({
        motionEnabled: event.data.motionEnabled,
        emojiEnabled: event.data.emojiEnabled,
        calibrated: event.data.calibrated
      });
    }
  }
});

// Function to inject overlay script - improved with better error handling
function injectOverlay() {
  return new Promise((resolve, reject) => {
    // First check if overlay is already in the DOM
    if (document.getElementById('subway-overlay-container')) {
      console.log("Overlay already exists in DOM");
      overlayInjected = true;
      resolve();
      return;
    }
    
    console.log("Creating overlay script element");
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('overlay.js');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('async', 'true');
    script.id = 'subway-overlay-script';
    
    script.onload = function() {
      console.log("Subway Overlay script loaded successfully");
      overlayInjected = true;
      resolve();
    };
    
    script.onerror = function(e) {
      console.error("Failed to load Subway Overlay script", e);
      overlayInjected = false;
      reject(new Error("Failed to load overlay script: " + e.message));
    };
    
    (document.head || document.documentElement).appendChild(script);
  });
} 