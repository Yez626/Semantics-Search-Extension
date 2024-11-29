import { System_prompt, Model_response, Test_content} from "./prompt.js";

document.getElementById('searchBtn').addEventListener('click', () => {

    const keyword = document.getElementById('keyword').value.trim();
    const actionToggle = document.getElementById("actionToggle");

    if(isActionToggled){
      return;
    }
    
    let pageContent = "";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
        if (response && response.content) {
          pageContent = response.content;
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
              const test = `"Embrace the ephemeral" has always been a slogan of rawtext.club, and fitting with that theme, we're starting over from scratch.`
              console.log(test === apiResponse)
              console.log(getStringDifference(test, apiResponse))
              // console.log(apiResponse)
              // displayApiResponse(apiResponse);
              hightlightContent(apiResponse)
            } else {
              displayApiResponse("No valid response content found.");
            }
          })
          .catch(error => {
            console.error("There was an error with the request:", error);
          });
      });
    });

});

function  hightlightContent(keyword) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: "highlightContent", keyword: keyword }, (response) => {
      if (response) {
        document.getElementById('result').innerText = `highlighted`;
      } else {
        document.getElementById('result').innerText = "Unable highlight.";
      }
    });
  });
}

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