function getTabContent() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: {tabId: activeTab.id},
      function: () => document.body.innerHTML
    }, (results) => {
      if (results && results[0]) {
        const content = results[0].result;
        processContent(content);
      } else {
        console.error('No results from script execution');
      }
    });
  });
}

function processContent(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const paragraphs = doc.body.getElementsByTagName('p');
  
  const main = document.querySelector('main');
  if (!main) {
    console.error('Main element not found');
    return;
  }

  Array.from(paragraphs).forEach((p, index) => {
    const div = document.createElement('div');
    div.innerHTML = p.outerHTML;
    div.className = 'chunk';
    div.style.backgroundColor = index % 2 === 0 ? '#f0f0f0' : '#ffffff';
    div.style.padding = '10px';
    div.style.margin = '5px 0';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '5px';
    main.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getTabContent();
});
