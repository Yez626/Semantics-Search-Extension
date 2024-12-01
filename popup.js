let currentIndex = 0;
let totalHighlights = 0;

let isActionToggled = false;
export {navigateToHighlight, isActionToggled, keywordField, searchBtn, nextBtn, prevBtn, resultField};
const keywordField = document.getElementById('keyword');
const searchBtn = document.getElementById('searchBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const resultField = document.getElementById('result');




const tooltip = document.getElementById("custom-tooltip");



const actionToggle = document.getElementById("actionToggle");
actionToggle.addEventListener('click', () => {
  isActionToggled = !isActionToggled;
  actionToggle.src = isActionToggled ? 'icon/manage_search_unselected.png' : 'icon/manage_search_selected.png';
  tooltip.style.opacity = "0"; // Fade-out effect
  tooltip.style.display = "none"; // Fully hide after fading out
});



document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("keyword");
  if (input) {
    input.focus();
  }
});

// Detect hover start
actionToggle.addEventListener("mouseenter", () => {
  const rect = actionToggle.getBoundingClientRect();
  
  if(isActionToggled){
    actionToggle.src = "icon/new/manage_search-1.png";
    tooltip.innerText = "absolute search"
  }else{
    actionToggle.src = "icon/new/manage_search.png";
    tooltip.innerText = "semantic search"
  }
  // Adjust the tooltip's position to be more left and up
  tooltip.style.left = `${rect.left - 55}px`; // Move 20px further left
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`; // Move 20px further up

  tooltip.style.display = "block";
  tooltip.style.opacity = "1";

});



// Detect hover end
actionToggle.addEventListener("mouseleave", () => {
  if(isActionToggled){
    actionToggle.src = "icon/new/manage_search-3.png";
    
  }else{
    actionToggle.src = "icon/new/manage_search-2.png";

  }
  tooltip.style.opacity = "0"; // Fade-out effect
  tooltip.style.display = "none"; // Fully hide after fading out


});

searchBtn.addEventListener('click', () => {
  const keyword = keywordField.value.trim();
  // const actionToggle = document.getElementById("actionToggle");
  console.log(keyword);
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
          resultField.innerText = `${currentIndex+1} / ${totalHighlights}`;
        } else {
          resultField.innerText = "Unable to search for the keyword.";
        }
      });
    });
  } else {
    resultField.innerText = "Please enter a keyword to search.";
  }
});

nextBtn.addEventListener('click', () => {
  if(!isActionToggled){
    return;
  }
  if (totalHighlights > 0) {
    currentIndex = (currentIndex + 1) % totalHighlights;
    resultField.innerText = `${currentIndex+1} / ${totalHighlights}`;
    navigateToHighlight(currentIndex);
  }
});

prevBtn.addEventListener('click', () => {
  if(!isActionToggled){
    return;
  }
  if (totalHighlights > 0) {
    currentIndex = (currentIndex - 1 + totalHighlights) % totalHighlights;
    resultField.innerText = `${currentIndex+1} / ${totalHighlights}`;
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

document.addEventListener('keydown', (event) => {
  if (isActionToggled && event.key === 'Enter' && !event.shiftKey) {
    if(totalHighlights === 0){
      searchBtn.click();
    }
    else{
      nextBtn.click();
    }
  }
});

keywordField.addEventListener('input', () => {
  if(isActionToggled){
    currentIndex=0;
    totalHighlights=0;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
      prevBtn.click();
      event.preventDefault();
  }
});