import "../styles/chatCard.css";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatCard = ({ chat, onClick }) => {
  const { selectedChat } = useContext(ChatContext);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }

    const otherUser = chat.users.find(
      (user) => user._id !== userInfo._id
    );

    return otherUser?.name || "Unknown User";
  };

  return (
    <div
      className={`chat-card ${selectedChat?._id === chat._id
          ? "active"
          : ""
        }`}
      onClick={onClick}
    >
      <div className="chat-avatar">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            getChatName()
          )}&background=random`}
          alt="avatar"
        />

        <span className="online-dot"></span>
      </div>

      <div className="chat-details">
        <div className="chat-top">
          <h4>{getChatName()}</h4>

          <span>
            {new Date(
              chat.updatedAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="chat-bottom">
          <p>
            {chat.latestMessage?.content ||
              "Start a conversation"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;