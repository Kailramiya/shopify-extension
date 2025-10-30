// /extensions/chat-widget/src/index.jsx

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function ChatWidget() {
  console.log("Rendering ChatWidget");
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraped, setScraped] = useState(false);

  // Backend base URL. When deployed as a ScriptTag, set window.SAIA = { backend: 'https://...' }
  const API_BASE = (window.SAIA && window.SAIA.backend) || window.SHOPIFY_AI_BACKEND || window.SAIA_BACKEND || location.origin;

  useEffect(() => {
    if (open && !scraped) {
      const currentUrl = window.location.href;
      fetch(`${API_BASE}/api/scrape`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentUrl }),
      })
        .then(() => setScraped(true))
        .catch((err) => console.error("Scrape error:", err));
    }
    if (!open) {
      setScraped(false);
      setAnswer("");
      setQuestion("");
    }
  }, [open]);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, url: window.location.href }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer received");
    } catch (err) {
      setAnswer("Error contacting backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // mount widget
  return (
    <>
      <button
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 99999,
          background: "#008060",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          fontSize: 24,
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close Chat" : "Open Chat"}
      >
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 350,
            maxHeight: 400,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            zIndex: 99999,
            padding: 20,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ marginBottom: 0, fontSize: 18 }}>Chat Assistant</h3>
            <button onClick={() => setOpen(false)} style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer"
            }}>×</button>
          </div>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button
            onClick={ask}
            disabled={loading || !question.trim()}
            style={{
              background: "#008060",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Thinking…" : "Ask"}
          </button>
          <div>
            <strong>Answer:</strong>
            <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
          </div>
        </div>
      )}
    </>
  );
}

// Mount React widget to the DOM on store page (safe: wait for body and avoid duplicates)
function mountWidget() {
  try {
    if (document.getElementById('shopify-chat-widget-root')) return; // already mounted
    const container = document.createElement('div');
    container.id = 'shopify-chat-widget-root';
    document.body.appendChild(container);
    ReactDOM.createRoot(container).render(<ChatWidget />);
  } catch (err) {
    // If mount fails, log to console but don't break the host page
    // eslint-disable-next-line no-console
    console.error('Failed to mount shopify chat widget', err);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountWidget();
} else {
  window.addEventListener('DOMContentLoaded', mountWidget, { once: true });
}
