// src/components/MessageList.jsx

// 👉 Enkel list-komponent som ritar alla pratbubblor.
//    - Mina bubblor hamnar till höger (right)
//    - Andras bubblor hamnar till vänster (left)
//    - På mina bubblor visas en "Radera"-knapp som triggar onDelete(id)

const MessageList = ({ messages, myId, onDelete }) => {
  // Små hjälpare för att plocka rätt fält oavsett API-form
  const getOwnerId = (m) => m.userId ?? m.user_id ?? m.user?.id;
  const getText = (m) => m.text ?? m.message ?? "";

  return (
    <div className="messages">
      {messages.map((m, i) => {
        const ownerId = getOwnerId(m); // vem äger meddelandet?
        const text = getText(m); // själva meddelandetexten
        const side = ownerId === myId ? "right" : "left"; // min/vänster-höger

        return (
          <div key={m.id || i} className={`message ${side}`}>
            {/* Själva bubblan */}
            <span>{text}</span>

            {/* Radera-knapp visas endast på MINA meddelanden */}
            {ownerId === myId && m.id && (
              <button
                className="delete-btn"
                title="Radera meddelande"
                onClick={() => onDelete(m.id)} // Chat.jsx hanterar confirm + API
              >
                Radera
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
