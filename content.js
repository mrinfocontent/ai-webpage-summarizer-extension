function extractCleanText() {
  const article =
    document.querySelector("article") ||
    document.querySelector("#mw-content-text") ||
    document.body;

  return article.innerText.replace(/\n{2,}/g, "\n").slice(0, 12000);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "EXTRACT_TEXT") {
    sendResponse({ text: extractCleanText() });
  }
});