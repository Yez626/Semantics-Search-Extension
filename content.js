// Remove any existing highlights
function removeHighlights() {
    const highlights = document.querySelectorAll('.highlighted-keyword');
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });
  }
  
  // Highlight all occurrences of the keyword
function highlightKeyword(keyword) {
    removeHighlights(); // Remove old highlights if present
    if (!keyword) return;
  
    const regex = new RegExp(`(${keyword})`, 'gi');
  
    function highlightTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.nodeValue.match(regex);
        if (matches) {
          const span = document.createElement('span');
          span.className = 'highlighted-keyword';
          span.style.backgroundColor = 'yellow';
          span.textContent = matches[0];
          const parts = node.nodeValue.split(regex);
          const fragment = document.createDocumentFragment();
          parts.forEach((part) => {
            if (regex.test(part)) {
              const highlightedSpan = document.createElement('span');
              highlightedSpan.className = 'highlighted-keyword';
              highlightedSpan.style.backgroundColor = 'yellow';
              highlightedSpan.textContent = part;
              fragment.appendChild(highlightedSpan);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          node.replaceWith(fragment);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length) {
        node.childNodes.forEach((child) => highlightTextNodes(child));
      }
    }
  
    highlightTextNodes(document.body);
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
  