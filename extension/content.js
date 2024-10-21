console.log('BidBuddy Co-pilot content script loaded');
chrome.runtime.sendMessage({action: "log", message: "Content script loaded"});

// Add this to test communication with the background script
chrome.runtime.sendMessage({action: "test", message: "Hello from content script"}, function(response) {
  console.log("Response from background script:", response);
});

// ... (rest of the content script remains the same)

// Add this at the end of the file
chrome.runtime.sendMessage({action: "log", message: "Content script fully executed"});