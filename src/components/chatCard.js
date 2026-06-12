import "../styles/chatCard.css";

const ChatCard = () => {
  return (
    <div className="chat-card active">
      <div className="chat-avatar">
        <img
          src="https://i.pravatar.cc/150?img=15"
          alt="avatar"
        />
        <span className="online-dot"></span>
      </div>

      <div className="chat-details">
        <div className="chat-top">
          <h4>Rahul Sharma</h4>
          <span>10:45 AM</span>
        </div>
        <div className="chat-bottom">
          <p>
            Let's finish the project today.
          </p>

          <div className="unread-count">
            3
          </div>

        </div>
      </div>

    </div>
  );
};

export default ChatCard;