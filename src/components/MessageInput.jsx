// src/components/MessageInput.jsx
import { useState } from "react";

// 👉 Input-komponent för att skriva och skicka nytt meddelande.
//    - Håller egen liten state för textfältet
//    - Anropar onSend(text) när man trycker Enter eller Skicka
//    - Om onSend returnerar true => tömmer fältet

const MessageInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");

  // Skicka meddelande när man klickar på knappen
  const handleSend = async () => {
    // Låt föräldern (Chat.jsx) bestämma sanering + API-anrop
    const ok = await onSend(text);
    if (ok) setText(""); // töm bara om allt gick bra
  };

  // Skicka när man trycker Enter (men inte Shift+Enter)
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  return (
    <div className="input-row">
      {/* Skriv-ruta */}
      <input
        type="text"
        placeholder="Create new message"
        className="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Write a new message"
      />

      {/* Skicka-knapp */}
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        Skicka
      </button>
    </div>
  );
};

export default MessageInput;
