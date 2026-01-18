document.getElementById("summarize").addEventListener("click", () => {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.textContent = "Summarizing...";

  chrome.runtime.sendMessage({ type: "SUMMARIZE" }, (response) => {
    if (chrome.runtime.lastError) {
      summaryDiv.textContent = chrome.runtime.lastError.message;
      return;
    }

    if (!response) {
      summaryDiv.textContent = "No response from background.";
      return;
    }

    if (response.error) {
      summaryDiv.textContent = "Error: " + response.error;
    } else {
      summaryDiv.textContent = response.summary;
    }
  });
});
