let currentIndex = -1;
let totalHighlights = 0;
let index_cnt = 0;
let total_cnt = 0;

// document.getElementById('getContentBtn').addEventListener('click', () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
//       if (response && response.content) {
//         document.getElementById('contentArea').innerText = response.content;
//       } else {
//         document.getElementById('contentArea').innerText = "Unable to extract content.";
//       }
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', () => {

  const getContentBtn = document.getElementById('getContentBtn');
  const contentArea = document.getElementById('contentArea');
  const searchBtn = document.getElementById('searchBtn');
  const keywordInput = document.getElementById('keyword');
  const resultArea = document.getElementById('result');
  
  if (getContentBtn) {
    getContentBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
          if (response && response.content) {
            contentArea.innerText = response.content;
          } else {
            contentArea.innerText = "Unable to extract content.";
          }
        });
      });
    });
  }

  if (searchBtn && keywordInput && resultArea) {
    searchBtn.addEventListener('click', () => {
      const keyword = keywordInput.value.trim();
      if (keyword) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: "searchKeyword", keyword: keyword }, (response) => {
            if (response && response.count !== undefined) {
              total_cnt = response.count;
              resultArea.innerText = `${index_cnt} / ${response.count}`;
            } else {
              resultArea.innerText = "Unable to search for the keyword.";
            }
          });
        });
      } else {
        resultArea.innerText = "Please enter a keyword to search.";
      }
    });
  }
});

let isActionToggled = false;

const actionToggle = document.getElementById("actionToggle");
actionToggle.addEventListener('click', () => {
  isActionToggled = !isActionToggled;
  actionToggle.src = isActionToggled ? 'icon/manage_search_selected.png' : 'icon/manage_search_unselected.png';
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const keyword = document.getElementById('keyword').value.trim();

  if(actionToggle.checked){
    return;
  }
  
  if (keyword) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "searchKeyword", keyword: keyword }, (response) => {
        if (response) {
          totalHighlights = response.count;
          currentIndex = -1;
          document.getElementById('result').innerText = `${index_cnt} / ${response.count}`;
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
    //currentIndex = (currentIndex + 1) % totalHighlights;
    currentIndex = currentIndex + 1
    index_cnt = index_cnt + 1
    document.getElementById('result').innerText = `${index_cnt} / ${total_cnt}`;
    navigateToHighlight(currentIndex);
  }
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (totalHighlights > 0) {
    //currentIndex = (currentIndex - 1 + totalHighlights) % totalHighlights;
    currentIndex = currentIndex - 1;
    index_cnt = index_cnt - 1
    document.getElementById('result').innerText = `${index_cnt} / ${total_cnt}`;
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
  index = index % highlights.length
  if (highlights.length > 0 && highlights[index]) {
    highlights[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlights.forEach((highlight, i) => {
      highlight.style.outline = (i === index) ? '2px solid red' : 'none';
    });
  }
}
