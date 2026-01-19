# AI Webpage Summarizer – Chrome Extension

A modern Chrome extension that summarizes the **currently open webpage** and allows users to **ask follow-up questions**, using their preferred AI provider.

Supported providers:
- **Groq (FREE, no credit card required)** ⭐
- OpenAI
- Google Gemini

The extension follows **Chrome Manifest V3 best practices** and accesses webpages **only on explicit user action**.

---

## ✨ Features

- 🔍 Summarize the active webpage (Wikipedia, blogs, news, docs, etc.)
- ❓ Ask follow-up questions based on the generated summary
- 🔁 Multiple AI providers supported:
  - Groq (default, free)
  - OpenAI
  - Gemini
- 🔑 User-provided API keys (no backend)
- 🧠 No tracking or analytics
- 🔒 API keys stored locally using Chrome storage
- ✅ Manifest V3 compliant
- 🚫 No background scraping
- 🌐 Active-tab only access

---

## 🧩 How It Works

1. Install the extension and Pin the extension
2. Right click the extension icon and open option page and give **API key** as input and save it. 
3. Open a webpage you want to Summarizer and click on the extension icon and click **Summarize Page**
4. Extension reads the **active tab**
5. Content is sent to OpenAI
6. Summary is displayed in the popup


---

## 📜 Permissions Explained

- **activeTab** : Access only the currently open webpage when the user clicks
- **scripting** : Extract webpage text on demand
- **storage** : Save user API key locally
