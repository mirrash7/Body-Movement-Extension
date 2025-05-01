document.getElementById('calibrate').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "calibrate"}, (response) => {
      console.log("Calibrate response:", response);
      if (chrome.runtime.lastError) {
        console.error("Error sending calibrate message:", chrome.runtime.lastError);
      }
    });
  });
});

document.getElementById('toggle').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {action: "toggle"}, (response) => {
      console.log("Toggle response:", response);
      if (chrome.runtime.lastError) {
        console.error("Error sending toggle message:", chrome.runtime.lastError);
      } else {
        this.textContent = this.textContent.includes('Enable') ? 
          'Disable Motion Control' : 'Enable Motion Control';
      }
    });
  });
}); 