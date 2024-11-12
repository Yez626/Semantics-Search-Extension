import Mark from 'mark.js';

function highlightKeyword(keyword) {
  removeHighlights(); // Custom function to clear previous highlights
  if (!keyword) return;

  var instance = new Mark(document.body);

  instance.mark(keyword, {
    className: 'highlighted-keyword',
    acrossElements: true,
    separateWordSearch: false,
    exclude: ['script', 'style'],
    done: () => {
      console.log('Highlighting complete');
    }
  });
}

function removeHighlights() {
  var instance = new Mark(document.body);
  instance.unmark();
}
  
  // Listen for messages from the popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getContent") {
      // Send back all the content from the page
      sendResponse({ content: document.body.innerText });
    } else if (request.type === "searchKeyword") {
      // Highlight the keyword and count occurrences
      highlightKeyword(request.keyword);
      const regex = new RegExp(request.keyword, 'gi');
      const matches = document.body.innerText.match(regex);
      sendResponse({ count: matches ? matches.length : 0 });
    } else if (request.type === "clearHighlights") {
      removeHighlights();
      sendResponse({ success: true });
    } else if (request.type === "highlightContent") {
      // Directly highlight the specified content
      highlightKeyword(request.keyword);
      sendResponse({ success: true });
    }
  });
  