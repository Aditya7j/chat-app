import "../styles/chatHeader.css";
import {
    FiPhone,
    FiVideo,
    FiMoreVertical,
    FiArrowLeft
} from "react-icons/fi";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatHeader = () => {

    const {
        selectedChat,
        onlineUsers,
        setShowChatWindow
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

    const getGroupSubtitle = () => {

        if (!selectedChat?.isGroupChat) {
            return "";
        }

        const members = selectedChat.users
            .filter(
                (user) =>
                    user._id !== userInfo._id
            )
            .map(
                (user) => user.name
            );

        if (members.length <= 3) {
            return members.join(", ");
        }

        const visibleMembers = members
            .slice(0, 3)
            .join(", ");

        const remainingCount =
            members.length - 3;

        return `${visibleMembers} +${remainingCount}`;
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

        const otherUser = getOtherUser();

        if (!otherUser?.lastSeen) {
            return "Offline";
        }

        const lastSeen = new Date(otherUser.lastSeen);
        const now = new Date();
        const isToday =
            lastSeen.toDateString() ===
            now.toDateString();

        const yesterday = new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        const isYesterday =
            lastSeen.toDateString() ===
            yesterday.toDateString();

        if (isToday) {

            return `Last seen today at ${lastSeen.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            )}`;
        }

        if (isYesterday) {

            return `Last seen yesterday at ${lastSeen.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            )}`;
        }

        const diffDays =
            Math.floor(
                (now - lastSeen) /
                (1000 * 60 * 60 * 24)
            );

        if (diffDays < 7) {

            return `Last seen ${lastSeen.toLocaleDateString(
                [],
                {
                    weekday: "long",
                }
            )}`;
        }

        return `Last seen ${lastSeen.toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        )}`;
    };

    return (
        <div className="chat-header">

            <div className="chat-user">

                <FiArrowLeft
                    className="mobile-back-btn"
                    onClick={() =>
                        setShowChatWindow(false)
                    }
                />

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

                    <h3>
                        {getChatName()}
                    </h3>

                    <span
                        className={
                            isOnline()
                                ? "online"
                                : "offline"
                        }
                    >
                        {selectedChat?.isGroupChat
                            ? getGroupSubtitle()
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