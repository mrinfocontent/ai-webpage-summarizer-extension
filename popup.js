let lastSummary = "";

document.getElementById("summarize").addEventListener("click", () => {
  const summaryDiv = document.getElementById("summary");
  summaryDiv.textContent = "Summarizing...";

  chrome.runtime.sendMessage({ type: "SUMMARIZE" }, (res) => {
    if (res?.error) {
      summaryDiv.textContent = res.error;
      return;
    }
    lastSummary = res.summary;
    summaryDiv.textContent = lastSummary;
  });
});

document.getElementById("ask").addEventListener("click", () => {
  const q = document.getElementById("question").value.trim();
  const answerDiv = document.getElementById("answer");

  if (!lastSummary) {
    answerDiv.textContent = "Please summarize first.";
    return;
  }

  answerDiv.textContent = "Thinking...";

  chrome.runtime.sendMessage(
    { type: "ASK", question: q, context: lastSummary },
    (res) => {
      answerDiv.textContent = res?.error || res.answer;
    }
  );
});
