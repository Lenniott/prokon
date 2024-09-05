console.log('prokon started');
let operationStatus = 'idle';

function getTabContent() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      function: () => document.body.innerText
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        operationStatus = 'error: ' + chrome.runtime.lastError.message;
      } else if (results && results[0]) {
        const content = results[0].result;
        console.log(content);
        operationStatus = 'content loaded';
      } else {
        operationStatus = 'error: no content found';
      }
      updateStatus();
    });
  });
}

function updateStatus() {
  const operationStatusElement = document.getElementById('operationStatus');
  if (operationStatusElement) {
    operationStatusElement.textContent = operationStatus;
  } else {
    console.error('Element with id "operationStatus" not found');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  getTabContent();
});
