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
  console.log("CHAT - localStorage:", auth);

  useEffect(() => {
    // Finns auth.objekt?
    if (!auth) {
      console.log("❌ Ingen auth hittad i localStorage. Skickar till login...");
      navigate("/", { replace: true });
      return;
    }

    // innehåller auth en token?
    if (!auth.token) {
      console.log("❌ Auth finns, men ingen token. Skickar till login...");
      navigate("/", { replace: true });
      return;
    }

    // användaren är inloggad
    console.log("✅ Användare är inloggad med token:", auth.token);
  }, [auth, navigate]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState("");

  // ID från auth
  const myId = auth?.id ?? auth?.userId;

  // Är meddelandet mitt?
  const isMine = (m) => m.userId === myId;

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      console.log(data);
      setMessages(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load messages");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = inputText.trim();
    if (!text) return;

    try {
      const created = await postMessage({ text });

      const myId = auth?.id ?? auth?.userId;
      const newMessage = {
        ...created,
        userId: created.userId || myId,
        user: created.user || { id: myId, username: auth?.user?.username },
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
      setError("");
    } catch (error) {
      setError(error.message || "Failed to send message");
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
          {error && <p className="error">{error}</p>}

          <ul className="message-list">
            {messages.map((meddelande) => {
              // Är meddelandet mitt?
              const mine = isMine(meddelande);

              // Bestäm avsändare
              let sender = "Other"; // default
              if (mine) {
                if (auth && auth.username) {
                  sender = auth.username;
                } else {
                  sender = "Me";
                }
              } else {
                if (meddelande && meddelande.user && meddelande.user.username) {
                  sender = meddelande.user.username;
                } else {
                  sender = "Other";
                }
              }

              // Bestäm text
              let text = "";
              if (
                meddelande &&
                meddelande.text !== undefined &&
                meddelande.text !== null
              ) {
                text = meddelande.text;
              } else if (
                meddelande &&
                meddelande.message !== undefined &&
                meddelande.message !== null
              ) {
                text = meddelande.message;
              } else {
                text = "";
              }
              return (
                <li
                  key={meddelande.id}
                  className={`message ${mine ? "right" : "left"}`}
                >
                  <span className="bubble">
                    <strong className="sender">{sender}</strong>
                    <span className="text">{text}</span>
                  </span>

                  {mine && (
                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(meddelande.id)}
                      aria-label="Delete message"
                      title="Delete message"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
          </form>
        </section>
      </main>
    </div>
  );
};

export default Chat;
