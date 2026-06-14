import "../styles/chatHeader.css";
import {
    FiPhone,
    FiVideo,
    FiMoreVertical,
} from "react-icons/fi";

import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatHeader = () => {

    const {
        selectedChat,
        onlineUsers,
    } = useContext(ChatContext);

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );

    const getOtherUser = () => {

        if (!selectedChat) return null;

        if (selectedChat.isGroupChat) {
            return null;
        }

        return selectedChat.users.find(
            (user) =>
                user._id !== userInfo._id
        );
    };

    const getChatName = () => {

        if (!selectedChat) return "";

        if (selectedChat.isGroupChat) {
            return selectedChat.chatName;
        }

        const otherUser =
            getOtherUser();

        return otherUser?.name || "";
    };

    const isOnline = () => {

        if (
            !selectedChat ||
            selectedChat.isGroupChat
        ) {
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

    const getLastSeen = () => {

        const otherUser =
            getOtherUser();

        if (!otherUser?.lastSeen) {
            return "Offline";
        }

        const lastSeenDate =
            new Date(otherUser.lastSeen);

        return `Last seen ${lastSeenDate.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        )}`;
    };

    return (
        <div className="chat-header">

            <div className="chat-user">

                <img
                    src={
                        getOtherUser()?.avatar
                            ? `http://localhost:5000${getOtherUser().avatar}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                getChatName()
                            )}&background=random`
                    }
                    alt="user"
                />

                <div>

                    <h3>{getChatName()}</h3>

                    <span
                        className={
                            isOnline()
                                ? "online"
                                : "offline"
                        }
                    >
                        {selectedChat?.isGroupChat
                            ? "Group Chat"
                            : isOnline()
                                ? "Online"
                                : getLastSeen()}
                    </span>

                </div>

            </div>

            <div className="chat-actions">

                <button>
                    <FiPhone />
                </button>

                <button>
                    <FiVideo />
                </button>

                <button>
                    <FiMoreVertical />
                </button>

            </div>

        </div>
    );
};

export default ChatHeader;