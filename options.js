document.addEventListener("DOMContentLoaded", () => {
  const keys = {
    groqKey: document.getElementById("groqKey"),
    openaiKey: document.getElementById("openaiKey"),
    geminiKey: document.getElementById("geminiKey")
  };

  const radios = document.querySelectorAll("input[name='provider']");
  const status = document.getElementById("status");

  chrome.storage.local.get(
    ["provider", "groqKey", "openaiKey", "geminiKey"],
    (d) => {
      if (d.provider) {
        document.querySelector(
          `input[value="${d.provider}"]`
        ).checked = true;
      }
      for (const k in keys) {
        if (d[k]) keys[k].value = d[k];
      }
    }
  );

  document.getElementById("save").addEventListener("click", () => {
    const provider = [...radios].find(r => r.checked).value;

    chrome.storage.local.set(
      {
        provider,
        groqKey: keys.groqKey.value.trim(),
        openaiKey: keys.openaiKey.value.trim(),
        geminiKey: keys.geminiKey.value.trim()
      },
      () => {
        status.textContent = "✅ Settings saved";
        status.style.color = "green";
      }
    );
  });
});
