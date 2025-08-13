import SideNav from "../components/SideNav";

const Chat = () => {
  return (
    <div className="chat-layout">
      <SideNav />

      {/* Chatt */}
      <main className="chat-container">
        <div className="messages">
          {/* Andras meddelande */}
          <div className="message left">
            This is a message from someone else
          </div>

          {/* Eget meddelande */}
          <div className="message right">This is my message</div>
        </div>

        {/* Inputfält */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Create new message"
            className="chat-input"
          />
        </div>
      </main>
    </div>
  );
};

export default Chat;
