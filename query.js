import { System_prompt, Model_response, Test_content} from "./prompt.js";
import { navigateToHighlight, isActionToggled , keywordField, searchBtn, nextBtn, prevBtn, resultField } from "./popup.js";

let searchHistory = [];
let currentIndex = 0;

searchBtn.addEventListener('click', () => {
    const keyword = keywordField.value.trim();

    clearSearch();

    if(isActionToggled){
      return;
    }

    searchKeyword(keyword);
});

function searchKeyword(keyword){
    resultField.innerHTML = '<img src="6d0ec30d8b8f77ab999f765edd8866e8a97d59a3.gif" alt="Loading..." id="loadingIcon"  style="width: 25px; height: 25px;">';

    let pageContent = "";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
          if (response && response.content) {
            pageContent = response.content;
            for(let str of searchHistory){
                pageContent = pageContent.split(str).join('');
            }
          } else {
            document.getElementById('contentArea').innerText = "Unable to extract content.";
          }
          const apiKey = "AIzaSyB-YDLxITdofEbDuCBUVKCg-yCh2n4UTUc";
      
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
          const data = {
            system_instruction: 
            {
              parts: [
                {
                  text: System_prompt
                }
              ]
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: "The context is:" + pageContent
                  }
                ]
              },
              {
                role: "user",
                parts: [
                  {
                    text: "The query is:" + keyword
                  }
                ]
              },
            ]
          };
          
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then(data => {
              console.log("Full API response:", data); // Log the full response for inspection
              
              if (data.candidates && data.candidates.length > 0) {
                const apiResponse = data.candidates[0].content.parts[0].text.trimEnd();
                console.log(apiResponse);

                if(pageContent.includes(apiResponse)){
                    searchHistory.push(apiResponse);
                    hightlightContent(apiResponse);
                    navigateToHighlight(0);
                    resultField.innerText = `${currentIndex+1} / ${searchHistory.length}`;
                }
                else{
                    resultField.innerText = `Failed To Find`;
                }
              }
              else{
                resultField.innerText = `API Error`;
              }
            })
            .catch(error => {
              console.error("There was an error with the request:", error);
              resultField.innerText = `API Error`;
            });
        });
      });  
}

function  hightlightContent(keyword) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "highlightContent", keyword: keyword }, (response) => {
      if (response) {
        console.log("highlighted");
      }
      else{
        console.log("error during highlight");
      }
    });
  });
}

nextBtn.addEventListener('click', () => {
    if(isActionToggled || searchHistory.length === 0){
        return;
    }

    currentIndex=currentIndex+1;

    if(currentIndex>=searchHistory.length){
        searchKeyword(keywordField.value.trim());
    }
    else{
        hightlightContent(searchHistory[currentIndex]);
        navigateToHighlight(0);
        resultField.innerText = `${currentIndex+1} / ${searchHistory.length}`;
    }
});
  
prevBtn.addEventListener('click', () => {
    if(isActionToggled || searchHistory.length === 0){
        return;
    }
    currentIndex = (currentIndex - 1 + searchHistory.length) % searchHistory.length

    hightlightContent(searchHistory[currentIndex]);
    navigateToHighlight(0);
    resultField.innerText = `${currentIndex+1} / ${searchHistory.length}`;
});

function clearSearch(){
  searchHistory = [];
  currentIndex = 0;
}

document.addEventListener('keydown', (event) => {
  if (!isActionToggled && event.key === 'Enter' && !event.shiftKey) {
    if(searchHistory.length === 0){
      searchBtn.click();
    }
    else{
      nextBtn.click();
    }
  }
});

keywordField.addEventListener('input', () => {
  if(!isActionToggled){
    clearSearch();
  }
});