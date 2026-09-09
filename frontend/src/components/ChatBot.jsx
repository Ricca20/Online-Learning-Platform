import { useState, useRef, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { Bot, X, Send, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const WELCOME = {
  role: "ai",
  text: "Hi! I'm your AI course advisor. Tell me what you want to learn or what career goal you're working towards, and I'll match you to the best courses in our catalog.",
};

function ChatBot() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to latest message whenever messages change
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";
      
      const response = await fetch(`${baseURL}/ai/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: text })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to fetch response");
      }

      // Add empty AI message that we will append to
      setMessages((prev) => [...prev, { role: "ai", text: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        
        const lines = chunkValue.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") {
              done = true;
              break;
            }
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) throw new Error("Stream error");
                if (parsed.text) {
                  setMessages((prev) => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].text += parsed.text;
                    return newMsgs;
                  });
                }
              } catch (e) {
                // Ignore partial JSON chunks parsing errors
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: error.message || "Something went wrong. Please try again.", error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Only show for authenticated students
  if (role !== "student") return null;

  return (
    <>
      {/* ── Chat Panel ── */}
      <div
        style={{
          position: "fixed",
          bottom: open ? "96px" : "-820px",
          right: "24px",
          width: "min(520px, calc(100vw - 48px))",
          height: open ? "min(75vh, 720px)" : "0px",
          maxHeight: "720px",
          background: "var(--color-bg-card)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 60px rgba(17,24,39,0.14), 0 8px 24px rgba(17,24,39,0.08)",
          display: "flex",
          flexDirection: "column",
          zIndex: 200,
          transition: "bottom 0.32s cubic-bezier(0.4, 0, 0.2, 1), height 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            background: "var(--color-accent)",
            color: "white",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bot size={20} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>
                AI Course Advisor
              </div>
              <div style={{ fontSize: "0.75rem", opacity: 0.75, marginTop: "2px" }}>
                Ask me anything about courses
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Minimise"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "4px",
              color: "white",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Messages */}
        <div
          id="chatbot-messages"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "82%",
                  padding: "12px 16px",
                  borderRadius:
                    msg.role === "user"
                      ? "var(--radius-lg) var(--radius-xs) var(--radius-lg) var(--radius-lg)"
                      : "var(--radius-xs) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
                  background:
                    msg.role === "user"
                      ? "var(--color-accent)"
                      : msg.error
                      ? "var(--color-danger-soft)"
                      : "var(--color-bg-elevated)",
                  color:
                    msg.role === "user"
                      ? "white"
                      : msg.error
                      ? "var(--color-danger)"
                      : "var(--color-text-primary)",
                  fontSize: "0.875rem",
                  lineHeight: "1.65",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  border:
                    msg.role === "ai" && !msg.error
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  padding: "10px 16px",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xs) var(--radius-lg) var(--radius-lg) var(--radius-lg)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "var(--color-text-muted)",
                      display: "inline-block",
                      animation: `chatDot 1.2s ${i * 0.2}s infinite ease-in-out`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: "10px",
            alignItems: "flex-end",
            flexShrink: 0,
            background: "var(--color-bg-elevated)",
          }}
        >
          <textarea
            ref={inputRef}
            id="chatbot-input"
            rows={1}
            placeholder="Ask about courses…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={handleKey}
            style={{
              flex: 1,
              resize: "none",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
              fontSize: "0.875rem",
              fontFamily: "var(--font-family)",
              color: "var(--color-text-primary)",
              background: "var(--color-bg-card)",
              outline: "none",
              lineHeight: "1.5",
              maxHeight: "100px",
              minHeight: "42px",
              overflowY: "auto",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--color-border)")
            }
          />
          <button
            id="chatbot-send-btn"
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="Send"
            style={{
              width: "40px",
              height: "40px",
              flexShrink: 0,
              background: loading || !input.trim()
                ? "var(--color-bg-card)"
                : "var(--color-accent)",
              color: loading || !input.trim()
                ? "var(--color-text-muted)"
                : "white",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* ── Floating Toggle Button ── */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI advisor" : "Open AI advisor"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "52px",
          height: "52px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-accent)",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-lg)",
          cursor: "pointer",
          zIndex: 201,
          transition: "transform 0.15s ease, background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-accent-hover)";
          e.currentTarget.style.transform = "scale(1.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--color-accent)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {open ? <X size={20} /> : <Bot size={24} />}
      </button>

      {/* Typing dot animation */}
      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </>
  );
}

export default ChatBot;
