// src/components/Chat.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import {
  fetchMessages,
  postMessage,
  deleteMessageById,
} from "../services/api.js";

const Chat = () => {
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  useEffect(() => {
    if (!auth?.token) navigate("/", { replace: true });
  }, [auth, navigate]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const myId = auth?.id ?? auth?.userId;
  const isMine = (m) =>
    m.userId === myId || m.user?.id === myId || m.authorId === myId;

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchMessages(); // <-- inga parametrar
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean) return;

    try {
      const created = await postMessage({ text: clean });

      const myId = auth?.id ?? auth?.userId;
      const withUser = {
        ...created,
        userId: created.userId ?? myId,
        user: created.user ?? { id: myId, username: auth?.user?.username },
      };

      setMessages((prev) => [...prev, withUser]);
      setInputText("");
    } catch (e) {
      setError(e?.message || "Failed to send message");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessageById(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError(e?.message || "Failed to delete message");
    }
  };

  return (
    <div className="page">
      <SideNav />
      <main className="chat-stage">
        <section className="chat-panel">
          <header className="chat-topbar">
            <button className="refresh-btn" onClick={loadMessages}>
              🔄 Refresh
            </button>
          </header>

          {error && <p className="error">{error}</p>}
          {loading && <div className="loading">Loading…</div>}

          <ul className="message-list">
            {messages.map((msg) => {
              const mine = isMine(msg);
              const sender = mine ? "Me" : msg.user?.username || "Other";
              return (
                <li
                  key={msg.id}
                  className={`message ${mine ? "right" : "left"}`}
                >
                  <span className="bubble">
                    <strong className="sender">{sender}</strong>
                    <span className="text">
                      {msg.text ?? msg.message ?? ""}
                    </span>
                  </span>
                  {mine && (
                    <button
                      className="delete"
                      onClick={() => handleDelete(msg.id)}
                    >
                      ✖
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <form className="input-bar" onSubmit={handleSend}>
            <input
              className="chat-input"
              type="text"
              placeholder="Create new message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <button className="send-btn" type="submit">
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Chat;
