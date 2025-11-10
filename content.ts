console.log("CONTENT SCRIPT LOADED:", window.location.href);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("CONTENT RECEIVED MESSAGE:", message);

  if (message.type === "FIND_LINKS") {
    // Собираем все ссылки
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a")
    ).map((a) => a.href);

    console.log("FOUND LINKS:", links);

    sendResponse({ links });
  }

  // ВАЖНО: return true позволяет работать sendResponse асинхронно
  return true;
});
