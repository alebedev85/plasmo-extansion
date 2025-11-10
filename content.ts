chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "FIND_LINKS") {
    const keyword = msg.keyword?.toLowerCase() || "";
    let links: string[] = [];

    // регулярка для ссылок вида https://vipr.im/<любой набор символов>
    const viprRegex = /^https:\/\/vipr\.im\/[\w-]+$/;

    if (keyword) {
      // получаем все div, текст которых содержит ключевое слово
      const matchingDivs = Array.from(document.querySelectorAll("li")).filter(div =>
        div.textContent?.toLowerCase().includes(keyword)
      );

      // берём второй блок (индекс 1)
      const div = matchingDivs[1];

      if (div) {
        links = Array.from(div.querySelectorAll("a"))
          .map(a => a.href)
          .filter(href => viprRegex.test(href)); // фильтруем по регулярке
      }
    } else {
      // если поле пустое — ищем все ссылки на странице и фильтруем по vipr.im
      links = Array.from(document.querySelectorAll("a"))
        .map(a => a.href)
        .filter(href => viprRegex.test(href));
    }

    sendResponse({ links });
  }

  return true; // для асинхронного sendResponse
});