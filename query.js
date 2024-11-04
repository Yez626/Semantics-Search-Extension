document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('keyword').value.trim();
    const apiKey = "AIzaSyB-YDLxITdofEbDuCBUVKCg-yCh2n4UTUc";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const data = {
      contents: [
        {
          parts: [
            {
              text: keyword
            }
          ]
        }
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