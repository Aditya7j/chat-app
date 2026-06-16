import "../styles/chatCard.css";
import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { FiTrash2 } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import DeleteChatModal from "./DeleteChatModal";

const ChatCard = ({ chat, onClick }) => {

  const {
    selectedChat,
    onlineUsers,
    chats,
    setChats,
    setSelectedChat,
  } = useContext(ChatContext);

  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDeleteChat = async () => {

    try {

      setDeleting(true);

      await api.delete(
        `/chat/${chat._id}`,
        {
          headers: {
            Authorization:
              `Bearer ${userInfo.token}`,
          },
        }
      );

      setChats(
        chats.filter(
          (item) =>
            item._id !== chat._id
        )
      );

      if (
        selectedChat?._id ===
        chat._id
      ) {
        setSelectedChat(null);
      }

      toast.success(
        "Chat deleted successfully"
      );

      setShowDeleteModal(false);

    } catch (error) {

      toast.error(
        error?.response?.data
          ?.message ||
        "Failed to delete chat"
      );

    } finally {

      setDeleting(false);

    }
  };

  return (
    <>
      <div
        className={`chat-card ${selectedChat?._id ===
            chat._id
            ? "active"
            : ""
          }`}
        onClick={onClick}
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

            <div className="chat-actions-right">

              <span>
                {new Date(
                  chat.updatedAt
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>

              <button
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                disabled={deleting}
              >
                {deleting ? (
                  <Oval
                    height={16}
                    width={16}
                    color="#ffffff"
                    secondaryColor="#ffffff"
                    strokeWidth={5}
                  />
                ) : (
                  <FiTrash2 />
                )}
              </button>

            </div>

          </div>

          <div className="chat-bottom">

            <p>
              {getLatestMessage()}
            </p>

          </div>

        </div>

      </div>

      <DeleteChatModal
        open={showDeleteModal}
        onClose={() =>
          setShowDeleteModal(false)
        }
        onDelete={handleDeleteChat}
        deleting={deleting}
      />
    </>
  );
};

export default ChatCard;