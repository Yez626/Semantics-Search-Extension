import { System_prompt, Model_response, Test_content} from "./prompt.js";
import { navigateToHighlight, isActionToggled } from "./popup.js";

let searchHistory = [];
let currentIndex = 0;

document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value.trim();

    searchHistory = [];
    currentIndex = 0;

    if(isActionToggled){
      return;
    }

    searchKeyword(keyword);
});

function searchKeyword(keyword){
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<img src="6d0ec30d8b8f77ab999f765edd8866e8a97d59a3.gif" alt="Loading..." id="loadingIcon"  style="width: 25px; height: 25px;">';

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
                    resultElement.innerText = `${currentIndex+1} / ${searchHistory.length}`;
                }
                else{
                    resultElement.innerText = `Failed To Find`;
                }
              }
            })
            .catch(error => {
              console.error("There was an error with the request:", error);
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

document.getElementById('nextBtn').addEventListener('click', () => {
    if(isActionToggled){
        return;
    }
    currentIndex=currentIndex+1;

    if(currentIndex>=searchHistory.length){
        searchKeyword(document.getElementById('keyword').value.trim());
    }
    else{
        hightlightContent(searchHistory[currentIndex]);
        navigateToHighlight(0);
        document.getElementById('result').innerText = `${currentIndex+1} / ${searchHistory.length}`;
    }
});
  
document.getElementById('prevBtn').addEventListener('click', () => {
    if(isActionToggled){
        return;
    }
    currentIndex = (currentIndex - 1 + searchHistory.length) % searchHistory.length

    hightlightContent(searchHistory[currentIndex]);
    navigateToHighlight(0);
    document.getElementById('result').innerText = `${currentIndex+1} / ${searchHistory.length}`;
});

function getStringDifference(str1, str2) {
  let differences = [];
  let maxLength = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLength; i++) {
      const char1 = str1[i] || "";  // If str1 is shorter, use an empty string
      const char2 = str2[i] || "";  // If str2 is shorter, use an empty string

      if (char1 !== char2) {
          differences.push({
              index: i,
              str1Char: char1,
              str2Char: char2
          });
      }
  }

  return differences;
}

function displayApiResponse(apiResponse) {
    document.getElementById("display").innerText = apiResponse;
}