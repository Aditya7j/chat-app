import "../styles/chatCard.css";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatCard = ({ chat, onClick }) => {

  const {
    selectedChat,
    onlineUsers,
  } = useContext(ChatContext);

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const getChatName = () => {

    if (chat.isGroupChat) {
      return chat.chatName;
    }

    const otherUser = chat.users.find(
      (user) =>
        user._id !== userInfo._id
    );

    return (
      otherUser?.name ||
      "Unknown User"
    );
  };

  const getOtherUser = () => {

    if (chat.isGroupChat) {
      return null;
    }

    return chat.users.find(
      (user) =>
        user._id !== userInfo._id
    );
  };

  const isOnline = () => {

    if (chat.isGroupChat) {
      return false;
    }

    const otherUser =
      getOtherUser();

    return onlineUsers.some(
      (user) =>
        user.userId ===
        otherUser?._id
    );
  };

  const getLatestMessage = () => {

    if (!chat.latestMessage) {
      return "Start a conversation";
    }

    let message =
      chat.latestMessage.content;

    if (message.length > 35) {
      message =
        message.substring(
          0,
          35
        ) + "...";
    }

    if (
      chat.latestMessage.sender
        ?._id ===
      userInfo._id
    ) {
      return `You: ${message}`;
    }

    return message;
  };

  return (
    <div
      className={`chat-card ${selectedChat?._id ===
        chat._id
        ? "active"
        : ""
        }`}
      onClick={() => {
        onClick();
      }}
    >
      <div className="chat-avatar">

        <img
          src={
            getOtherUser()?.avatar
              ? `http://localhost:5000${getOtherUser().avatar}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                getChatName()
              )}&background=random`
          }
          alt="avatar"
        />

        {!chat.isGroupChat &&
          isOnline() && (
            <span className="online-dot"></span>
          )}

      </div>

      <div className="chat-details">

        <div className="chat-top">

          <h4>
            {getChatName()}
          </h4>

          <span>
            {new Date(
              chat.updatedAt
            ).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute:
                  "2-digit",
              }
            )}
          </span>

        </div>

        <div className="chat-bottom">

          <p>
            {getLatestMessage()}
          </p>

        </div>

      </div>
    </div>
  );
};

export default ChatCard;