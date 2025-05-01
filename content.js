// Inject the overlay script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('overlay.js');
script.setAttribute('type', 'text/javascript');
script.setAttribute('async', 'true');
(document.head || document.documentElement).appendChild(script);

script.onload = function() {
  console.log("Subway Overlay script loaded successfully");
  this.remove();
};

script.onerror = function() {
  console.error("Failed to load Subway Overlay script");
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.action === "toggle") {
    window.postMessage({
      type: "SUBWAY_TOGGLE",
      source: "extension",
      enabled: message.enabled
    }, "*");
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