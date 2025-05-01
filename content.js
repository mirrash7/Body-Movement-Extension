// Inject the overlay script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('overlay.js');
script.setAttribute('type', 'text/javascript');
script.setAttribute('async', 'true');
(document.head || document.documentElement).appendChild(script);
script.onload = function() {
  console.log("Overlay script loaded successfully");
  // Remove the script element after it has loaded
  this.remove();
};
script.onerror = function() {
  console.error("Failed to load overlay script");
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  if (message.action === "calibrate") {
    window.postMessage({type: "SUBWAY_CALIBRATE", source: "extension"}, "*");
  } else if (message.action === "toggle") {
    window.postMessage({type: "SUBWAY_TOGGLE", source: "extension"}, "*");
  }
  // Send response to confirm receipt
  sendResponse({status: "received"});
  return true;
}); 