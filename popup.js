let currentIndex = 0;
let totalHighlights = 0;

let isActionToggled = false;

const actionToggle = document.getElementById("actionToggle");
actionToggle.addEventListener('click', () => {
  isActionToggled = !isActionToggled;
  actionToggle.src = isActionToggled ? 'icon/manage_search_unselected.png' : 'icon/manage_search_selected.png';
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value.trim();
  // const actionToggle = document.getElementById("actionToggle");

  if(!isActionToggled){
    return;
  }
  if (keyword) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "searchKeyword", keyword: keyword }, (response) => {
        if (response) {
          totalHighlights = response.count;
          currentIndex = 0;
          navigateToHighlight(currentIndex);
          document.getElementById('result').innerText = `${currentIndex+1} / ${totalHighlights}`;
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
  if(!isActionToggled){
    return;
  }
  if (totalHighlights > 0) {
    currentIndex = (currentIndex + 1) % totalHighlights;
    document.getElementById('result').innerText = `${currentIndex+1} / ${totalHighlights}`;
    navigateToHighlight(currentIndex);
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if(!isActionToggled){
    return;
  }
  if (totalHighlights > 0) {
    currentIndex = (currentIndex - 1 + totalHighlights) % totalHighlights;
    document.getElementById('result').innerText = `${currentIndex+1} / ${totalHighlights}`;
    navigateToHighlight(currentIndex);
  }
});

function navigateToHighlight(index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: highlightAndScroll,
        args: [index, isActionToggled],
      }
    );
  });
}

function highlightAndScroll(index, isActionToggled) {
  
  const highlights = document.querySelectorAll('.highlighted-keyword');
  index = index % highlights.length
  if (highlights.length > 0 && highlights[index]) {
    highlights[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    if(isActionToggled){
      highlights.forEach((highlight, i) => {
        highlight.style.outline = (i === index) ? '2px solid red' : 'none';
      });
    }
  }
}

export {navigateToHighlight, isActionToggled};