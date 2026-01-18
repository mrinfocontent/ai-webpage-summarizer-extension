document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("apiKey");
  const saveBtn = document.getElementById("save");
  const status = document.getElementById("status");

  // DEBUG: prove options.js is running
  console.log("options.js loaded");

  // Load saved key
  chrome.storage.local.get("openaiKey", (result) => {
    if (result.openaiKey) {
      input.value = result.openaiKey;
    }
  });

  // Save key
  saveBtn.addEventListener("click", () => {
    const key = input.value.trim();

    if (!key) {
      status.style.color = "red";
      status.textContent = "❌ API key cannot be empty";
      return;
    }

    chrome.storage.local.set({ openaiKey: key }, () => {
      status.style.color = "green";
      status.textContent = "✅ API key saved successfully";
      console.log("API key saved");
    });
  });
});
