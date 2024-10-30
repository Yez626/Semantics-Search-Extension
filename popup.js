let currentIndex = -1;
let totalHighlights = 0;

document.getElementById('getContentBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
      if (response && response.content) {
        document.getElementById('contentArea').innerText = response.content;
      } else {
        document.getElementById('contentArea').innerText = "Unable to extract content.";
      }
    });
  });
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value.trim();
  
  if (keyword) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "searchKeyword", keyword: keyword }, (response) => {
        if (response) {
          totalHighlights = response.count;
          currentIndex = -1;
          document.getElementById('result').innerText = `Found ${response.count} occurrence(s) of "${keyword}"`;
        } else {
          document.getElementById('result').innerText = "Unable to search for the keyword.";
        }
      });
    });
  } else {
    document.getElementById('result').innerText = "Please enter a keyword to search.";
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  if (totalHighlights > 0) {
    currentIndex = (currentIndex + 1) % totalHighlights;
    navigateToHighlight(currentIndex);
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (totalHighlights > 0) {
    currentIndex = (currentIndex - 1 + totalHighlights) % totalHighlights;
    navigateToHighlight(currentIndex);
  }
});

function navigateToHighlight(index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: highlightAndScroll,
        args: [index],
      }
    );
  });
}

function highlightAndScroll(index) {
  const highlights = document.querySelectorAll('.highlighted-keyword');
  if (highlights.length > 0 && highlights[index]) {
    highlights[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlights.forEach((highlight, i) => {
      highlight.style.outline = (i === index) ? '2px solid red' : 'none';
    });
  }
}
