/* =======================
   MODEL LISTS (SAFE)
======================= */

const GROQ_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768"
];

const GEMINI_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-pro"
];

/* =======================
   PAGE TEXT EXTRACTION
======================= */

async function extractText(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => document.body.innerText.slice(0, 12000)
  });
  return result;
}

/* =======================
   GROQ (FREE, FALLBACK)
======================= */

async function groq(prompt, apiKey) {
  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }]
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Groq API error");
      }

      if (data.choices?.length) {
        return data.choices[0].message.content;
      }
    } catch (e) {
      // try next model
    }
  }

  throw new Error(
    "No supported Groq model available for this API key."
  );
}

/* =======================
   OPENAI
======================= */

async function openai(prompt, apiKey) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "OpenAI API error");
  }

  return data.choices[0].message.content;
}

/* =======================
   GEMINI (UNIVERSAL)
======================= */

async function gemini(prompt, apiKey) {
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: prompt }] }
            ]
          })
        }
      );

      const data = await res.json();

      if (data.candidates?.length) {
        return data.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      // try next model
    }
  }

  throw new Error(
    "No supported Gemini model available for this API key."
  );
}

/* =======================
   MESSAGE HANDLER
======================= */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      const {
        provider,
        groqKey,
        openaiKey,
        geminiKey
      } = await chrome.storage.local.get([
        "provider",
        "groqKey",
        "openaiKey",
        "geminiKey"
      ]);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.id) {
        throw new Error("No active tab found.");
      }

      const pageText = await extractText(tab.id);

      const prompt =
        msg.type === "ASK"
          ? `Summary:\n${msg.context}\n\nQuestion:\n${msg.question}`
          : `Summarize the following webpage clearly:\n\n${pageText}`;

      let result;

      if (provider === "openai") {
        if (!openaiKey) throw new Error("OpenAI API key not set.");
        result = await openai(prompt, openaiKey);
      } else if (provider === "gemini") {
        if (!geminiKey) throw new Error("Gemini API key not set.");
        result = await gemini(prompt, geminiKey);
      } else {
        if (!groqKey) throw new Error("Groq API key not set.");
        result = await groq(prompt, groqKey);
      }

      sendResponse(
        msg.type === "ASK"
          ? { answer: result }
          : { summary: result }
      );
    } catch (err) {
      sendResponse({ error: err.message });
    }
  })();

  return true;
});
