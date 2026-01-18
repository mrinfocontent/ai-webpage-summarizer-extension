# AI Webpage Summarizer – Chrome Extension

A Chrome extension that summarizes the **currently open webpage** and allows users to ask follow-up questions using their **own OpenAI API key**.

The extension follows Chrome Manifest V3 best practices and accesses **only the active tab on explicit user action**.

---

## ✨ Features

- 🔍 Summarize the active webpage (Wikipedia, blogs, news sites, etc.)
- ❓ Ask follow-up questions based on the summary
- 🔑 Uses **user-provided OpenAI API key**
- 🧠 No backend required
- 🔒 API key stored securely using Chrome storage
- ✅ Manifest V3 compliant
- 🚫 No background tracking
- 🌐 Works only on user click (active tab only)

---

## 🧩 How It Works

1. Install the extension and Pin the extension
2. Right click the extension icon and open option page and give **Open AI  API key** as input and save it. 
3. Open a webpage you want to Summarizer and click on the extension icon and click **Summarize Page**
4. Extension reads the **active tab**
5. Content is sent to OpenAI
6. Summary is displayed in the popup


---
##📜 **Permissions Explained**

-**activeTab** – Access only the currently open webpage when the user clicks
-**scripting** – Extract webpage text on demand
-**storage** – Save user API key locally
