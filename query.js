import { System_prompt, Model_response, Test_content} from "./prompt.js";

document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value.trim();

    let pageContent = "";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "getContent" }, (response) => {
        if (response && response.content) {
          pageContent = response.content;
        } else {
          document.getElementById('contentArea').innerText = "Unable to extract content.";
        }
      });
    });

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
              text: "The context is" + Test_content
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: "The query is" + keyword
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
          const apiResponse = data.candidates[0].content.parts[0].text;
          displayApiResponse(apiResponse);
        } else {
          displayApiResponse("No valid response content found.");
        }
      })
      .catch(error => {
        console.error("There was an error with the request:", error);
      });
});

function displayApiResponse(apiResponse) {
    document.getElementById("display").innerText = apiResponse;
}