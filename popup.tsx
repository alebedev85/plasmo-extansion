import { useState } from "react";

export default function Popup() {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<string[]>([]);

  const handleFindLinks = async () => {
    setLoading(true);
    setLinks([]);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      const response = await chrome.tabs.sendMessage(tab.id!, {
        type: "FIND_LINKS"
      });

      setLinks(response?.links || []);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div style={{ minWidth: 300, padding: 16, fontFamily: "sans-serif" }}>
      <button
        onClick={handleFindLinks}
        style={{
          padding: "8px 12px",
          marginBottom: 12,
          cursor: "pointer",
          width: "100%"
        }}
      >
        {loading ? "Поиск..." : "Найти все ссылки"}
      </button>

      {loading && <div>⏳ Поиск ссылок…</div>}

      {!loading && links.length > 0 && (
        <div>
          <h3>Найденные ссылки:</h3>
          <ul style={{ maxHeight: 200, overflow: "auto" }}>
            {links.map((link, i) => (
              <li key={i}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && links.length === 0 && (
        <div style={{ opacity: 0.6 }}>Нажми кнопку, чтобы найти ссылки</div>
      )}
    </div>
  );
}
