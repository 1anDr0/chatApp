// src/pages/Chat.jsx
import { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {
  fetchMessages,
  postMessage,
  deleteMessageById,
} from "./services/api.js";
import { sanitizeMessage } from "./utils/sanitize.js";

/**
 * getAuth
 * ---------------------------------------
 * Hämtar auth-objektet vi sparade vid inloggning (token + id + ev. user).
 * Liten try/catch så appen inte kraschar om localStorage innehåller skräp.
 */
const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
};

const Chat = () => {
  // === State (lådor där vi sparar saker under tiden appen kör) ===
  const [messages, setMessages] = useState([]); // alla pratbubblor
  const [loading, setLoading] = useState(true); // visar "laddar..."
  const [error, setError] = useState(""); // snäll feltext om något går snett

  // === Vem är jag? ===
  const auth = getAuth();
  const token = auth?.token;
  const myId = auth?.id || auth?.user?.id; // ibland ligger id i auth.id, ibland i auth.user.id

  /**
   * load
   * ---------------------------------------
   * Hämta ALLA meddelanden från servern och lägg i state.
   * Visar laddning under tiden och fångar fel.
   */
  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchMessages(token);
      setMessages(list);
    } catch (e) {
      setError(e.message || "Kunde inte hämta meddelanden.");
    } finally {
      setLoading(false);
    }
  };

  // Hämta direkt när sidan öppnas
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * handleSend
   * ---------------------------------------
   * Tar emot rå text från input-komponenten:
   * 1) Sanerar texten (tar bort HTML + onödiga mellanslag)
   * 2) Postar till API
   * 3) Laddar om listan
   * Returnerar true/false så input vet om den ska tömma fältet.
   */
  const handleSend = async (rawText) => {
    try {
      setError("");

      if (!token) {
        setError("Du är inte inloggad.");
        return false;
      }

      const clean = sanitizeMessage(rawText);
      if (!clean) {
        setError("Meddelandet kan inte vara tomt.");
        return false;
      }

      await postMessage(token, clean);
      await load();
      return true; // ok -> töm input
    } catch (e) {
      setError(e.message || "Kunde inte skicka meddelandet.");
      return false; // fel -> behåll texten
    }
  };

  /**
   * handleDelete
   * ---------------------------------------
   * Raderar ett meddelande med visst id.
   * Visar confirm först, anropar API och laddar om listan.
   */
  const handleDelete = async (msgId) => {
    try {
      setError("");
      const ok = window.confirm("Radera meddelandet?");
      if (!ok) return;
      await deleteMessageById(token, msgId);
      await load();
    } catch (e) {
      setError(e.message || "Kunde inte radera meddelandet.");
    }
  };

  // === UI ===
  return (
    <div className="chat-layout">
      {/* Sidomeny med Logout m.m. */}
      <SideNav />

      <main className="chat-container">
        {/* Statusrader (enkla och tydliga) */}
        {loading && <div className="loading">Laddar meddelanden…</div>}
        {error && !loading && <div className="error">{error}</div>}

        {/* När det är laddat: lista + input */}
        {!loading && (
          <>
            <MessageList
              messages={messages}
              myId={myId}
              onDelete={handleDelete}
            />
            <MessageInput onSend={handleSend} disabled={!token} />
          </>
        )}
      </main>
    </div>
  );
};

export default Chat;
