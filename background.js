chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SUMMARIZE") return;

  (async () => {
    try {
      // 1️⃣ Load API key
      const { openaiKey } = await chrome.storage.local.get("openaiKey");

      if (!openaiKey) {
        sendResponse({ error: "OpenAI API key not found. Set it in Options." });
        return;
      }

      // 2️⃣ Get active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      // 3️⃣ Extract page text (ACTIVE TAB ONLY)
      const [{ result: pageText }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText.slice(0, 12000)
      });

      // 4️⃣ Call OpenAI
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Summarize the webpage clearly." },
            { role: "user", content: pageText }
          ]
        })
      });

      const data = await res.json();

      if (!data.choices) {
        sendResponse({ error: JSON.stringify(data) });
        return;
      }

      sendResponse({ summary: data.choices[0].message.content });

    } catch (err) {
      sendResponse({ error: err.message });
    }
  })();

  // 🔴 THIS LINE IS CRITICAL
  return true;
});
