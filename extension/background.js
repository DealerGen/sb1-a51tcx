chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('carwow.co.uk')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => console.log("Content script injected")).catch(err => console.error("Error injecting content script:", err));
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in background script:", request);
  if (request.action === "log") {
    console.log("Content script log:", request.message);
  } else if (request.action === "test") {
    console.log("Test message received:", request.message);
    sendResponse({status: "OK", message: "Hello from background script"});
  }
  return true; // Indicates that the response will be sent asynchronously
});