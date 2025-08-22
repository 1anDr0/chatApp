// src/components/Chat.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMessages,
  postMessage,
  deleteMessageById,
} from "../services/api.js";

const Chat = () => {
  const navigate = useNavigate();

  // 1) Kolla auth
  const auth = JSON.parse(localStorage.getItem("auth") || "null");

  useEffect(() => {
    if (!auth?.token) {
      navigate("/", { replace: true }); // till Login
    }
  }, [auth, navigate]);

  // 2) State
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // 3) Hämta meddelanden
  const loadMessages = async () => {
    setError("");
    try {
      const data = await fetchMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load messages");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // 4) Skicka meddelande
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const created = await postMessage({ message: text.trim() });
      setMessages((prev) => [...prev, created]);
      setText("");
    } catch (err) {
      setError(err?.message || "Failed to send message");
    }
  };

  // 5) Radera meddelande
  const handleDelete = async (id) => {
    try {
      await deleteMessageById(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err?.message || "Failed to delete message");
    }
  };

  // Hjälp: Är meddelandet mitt?
  const isMine = (msg) => {
    const myId = auth?.id ?? auth?.userId;
    return (
      msg.userId === myId || msg.user?.id === myId || msg.authorId === myId
    );
  };

  return (
    <div>
      <h2>Chat</h2>

      <div>
        <button onClick={loadMessages}>Refresh</button>
        <button
          onClick={() => {
            localStorage.removeItem("auth");
            navigate("/", { replace: true });
          }}
        >
          Log out
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            <strong>{isMine(m) ? "(me)" : m.user?.username || "other"}:</strong>{" "}
            {m.message}{" "}
            {isMine(m) && (
              <button onClick={() => handleDelete(m.id)}>delete</button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSend}>
        <input
          type="text"
          name="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
