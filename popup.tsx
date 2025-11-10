import { useState } from "react";

export default function Popup() {
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState(""); // ключевое слово

  const findLinks = async () => {
    setLoading(true);
    setLinks([]);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await chrome.tabs.sendMessage(tab.id!, {
      type: "FIND_LINKS",
      keyword: keyword.trim() // передаем ключевое слово
    });

    setLinks(response.links || []);
    setLoading(false);
  };

  return (
    <div style={{ minWidth: 300, padding: 16 }}>
      <input
        type="text"
        placeholder="Введите ключевое слово"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <button onClick={findLinks} style={{ width: "100%", padding: 10 }}>
        {loading ? "Идет поиск…" : "Найти ссылки"}
      </button>

      {loading && <div>⏳ Поиск…</div>}

      {!loading && links.length > 0 && (
        <>
          <ul style={{ maxHeight: 200, overflow: "auto", marginTop: 8 }}>
            {links.map((l, i) => (
              <li key={i}>
                <a href={l} target="_blank" rel="noreferrer">{l}</a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 8, fontWeight: "bold" }}>
            Найдено ссылок: {links.length}
          </div>
        </>
      )}

      {!loading && links.length === 0 && (
        <div style={{ marginTop: 8 }}>Ссылки не найдены</div>
      )}
    </div>
  );
}
