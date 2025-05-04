// Keep track of the popup window
let popupWindow = null;

// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // If popup is already open, focus it
  if (popupWindow) {
    chrome.windows.update(popupWindow.id, { focused: true });
    return;
  }
  
  // Otherwise, create a new popup window
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 350,
    height: 500
  }, (window) => {
    popupWindow = window;
  });
});

// Listen for window close events to reset popupWindow
chrome.windows.onRemoved.addListener((windowId) => {
  if (popupWindow && popupWindow.id === windowId) {
    popupWindow = null;
    
    // When popup is closed, disable motion control on all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        // Only send message to active tabs to avoid errors
        if (tab.active) {
          chrome.tabs.sendMessage(tab.id, {
            action: "toggle",
            enabled: false
          }, () => {
            // Ignore errors for tabs that don't have the content script
            if (chrome.runtime.lastError) {
              console.log("Error sending message to tab:", chrome.runtime.lastError);
            }
          });
        }
      });
    });
    
    // Update storage
    chrome.storage.local.set({motionEnabled: false});
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "popupOpened") {
    // Store reference to the popup window
    chrome.windows.getCurrent((window) => {
      popupWindow = window;
    });
    sendResponse({status: "acknowledged"});
    return true;
  }
}); 