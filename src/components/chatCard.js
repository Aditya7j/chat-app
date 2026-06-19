import "../styles/chatCard.css";

import {
  useContext,
  useState,
} from "react";

import { ChatContext } from "../context/ChatContext";
import { FiTrash2 } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import DeleteChatModal from "./DeleteChatModal";

const ChatCard = ({
  chat,
  onClick,
}) => {

  const {
    selectedChat,
    onlineUsers,
    setChats,
    setSelectedChat,
  } = useContext(ChatContext);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const storedUserInfo =
    localStorage.getItem(
      "userInfo"
    );

  const userInfo =
    storedUserInfo
      ? JSON.parse(
        storedUserInfo
      )
      : {};

  const unreadCount =
    Number(
      chat.unreadCount
    ) || 0;

  const getOtherUser = () => {

    if (chat.isGroupChat) {
      return null;
    }

    return chat.users?.find(
      (user) =>
        user._id !==
        userInfo._id
    );
  };

  const getChatName = () => {

    if (chat.isGroupChat) {
      return (
        chat.chatName ||
        "Unnamed Group"
      );
    }

    return (
      getOtherUser()?.name ||
      "Unknown User"
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

  const getAvatarUrl = () => {

    const otherUser =
      getOtherUser();

    if (otherUser?.avatar) {

      if (
        otherUser.avatar.startsWith(
          "http"
        )
      ) {
        return otherUser.avatar;
      }

      return `http://localhost:5000${otherUser.avatar}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getChatName()
    )}&background=random`;
  };

  const getLatestMessage = () => {

    if (
      !chat.latestMessage
    ) {
      return "Start a conversation";
    }

    let message =
      chat.latestMessage.content ||
      "";

    if (
      message.length > 35
    ) {
      message =
        `${message.substring(
          0,
          35
        )}...`;
    }

    const latestSender =
      chat.latestMessage.sender;

    const latestSenderId =
      typeof latestSender ===
        "object"
        ? latestSender?._id
        : latestSender;

    if (
      latestSenderId ===
      userInfo._id
    ) {
      return `You: ${message}`;
    }

    if (
      chat.isGroupChat &&
      latestSender?.name
    ) {
      return `${latestSender.name}: ${message}`;
    }

    return message;
  };

  const getUpdatedTime = () => {

    if (!chat.updatedAt) {
      return "";
    }

    const updatedDate =
      new Date(
        chat.updatedAt
      );

    if (
      Number.isNaN(
        updatedDate.getTime()
      )
    ) {
      return "";
    }

    return updatedDate
      .toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
  };

  const handleDeleteChat =
    async () => {

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
          (previousChats) =>
            previousChats.filter(
              (item) =>
                item._id !==
                chat._id
            )
        );

        if (
          selectedChat?._id ===
          chat._id
        ) {
          setSelectedChat(
            null
          );
        }

        toast.success(
          "Chat deleted successfully"
        );

        setShowDeleteModal(
          false
        );

      } catch (error) {

        toast.error(
          error?.response
            ?.data?.message ||
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
              getAvatarUrl()
            }
            alt={
              getChatName()
            }
          />

          {!chat.isGroupChat &&
            isOnline() && (
              <span className="online-dot" />
            )}

        </div>

        <div className="chat-details">

          <div className="chat-top">

            <h4>
              {getChatName()}
            </h4>

            <div className="chat-actions-right">

              <span className="chat-updated-time">
                {getUpdatedTime()}
              </span>

              <button
                type="button"
                className="delete-chat-btn"
                aria-label="Delete chat"
                onClick={(event) => {
                  event.stopPropagation();

                  setShowDeleteModal(
                    true
                  );
                }}
                disabled={
                  deleting
                }
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

            <p
              className={
                unreadCount > 0
                  ? "unread-message-preview"
                  : ""
              }
            >
              {getLatestMessage()}
            </p>

            {unreadCount > 0 && (
              <span
                className="unread-count"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

          </div>

        </div>

      </div>

      <DeleteChatModal
        open={
          showDeleteModal
        }
        onClose={() =>
          setShowDeleteModal(
            false
          )
        }
        onDelete={
          handleDeleteChat
        }
        deleting={deleting}
      />
    </>
  );
};

export default ChatCard;