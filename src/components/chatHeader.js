import "../styles/chatHeader.css";
import {
    FiPhone,
    FiVideo,
    FiMoreVertical,
    FiArrowLeft
} from "react-icons/fi";
import {
    useContext,
    useState
} from "react";
import { ChatContext } from "../context/ChatContext";
import GroupInfoModal from "./groupInfoModal";

const SERVER_URL =
    process.env.REACT_APP_SOCKET_URL ||
    "http://localhost:5000";

const ChatHeader = () => {

    const {
        selectedChat,
        onlineUsers,
        setShowChatWindow
    } = useContext(ChatContext);

    const [showGroupInfo, setShowGroupInfo] =
        useState(false);

    const storedUserInfo =
        localStorage.getItem("userInfo");

    const userInfo = storedUserInfo
        ? JSON.parse(storedUserInfo)
        : {};

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

        const lastSeen =
            new Date(otherUser.lastSeen);

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

    const openGroupInfo = () => {

        if (!selectedChat?.isGroupChat) {
            return;
        }

        setShowGroupInfo(true);
    };

    const handleGroupInfoKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            openGroupInfo();
        }
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

            return `${SERVER_URL}${otherUser.avatar}`;
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            getChatName()
        )}&background=random`;
    };

    return (
        <>
            <div className="chat-header">

                <div className="chat-user">

                    <FiArrowLeft
                        className="mobile-back-btn"
                        onClick={() =>
                            setShowChatWindow(false)
                        }
                    />

                    <div
                        className={`chat-user-details ${selectedChat?.isGroupChat
                                ? "group-clickable"
                                : ""
                            }`}
                        onClick={openGroupInfo}
                        onKeyDown={
                            handleGroupInfoKeyDown
                        }
                        role={
                            selectedChat?.isGroupChat
                                ? "button"
                                : undefined
                        }
                        tabIndex={
                            selectedChat?.isGroupChat
                                ? 0
                                : undefined
                        }
                    >
                        <img
                            src={getAvatarUrl()}
                            alt={
                                selectedChat?.isGroupChat
                                    ? "Group"
                                    : "User"
                            }
                        />

                        <div className="chat-user-text">

                            <h3>
                                {getChatName()}
                            </h3>

                            <span
                                className={
                                    selectedChat
                                        ?.isGroupChat
                                        ? "group-members-status"
                                        : isOnline()
                                            ? "online"
                                            : "offline"
                                }
                            >
                                {selectedChat
                                    ?.isGroupChat
                                    ? getGroupSubtitle()
                                    : isOnline()
                                        ? "Online"
                                        : getLastSeen()}
                            </span>

                        </div>
                    </div>

                </div>

                <div className="chat-actions">

                    <button
                        type="button"
                        aria-label="Start voice call"
                    >
                        <FiPhone />
                    </button>

                    <button
                        type="button"
                        aria-label="Start video call"
                    >
                        <FiVideo />
                    </button>

                    <button
                        type="button"
                        aria-label="Open chat information"
                        onClick={openGroupInfo}
                    >
                        <FiMoreVertical />
                    </button>

                </div>

            </div>

            {showGroupInfo &&
                selectedChat?.isGroupChat && (
                    <GroupInfoModal
                        chat={selectedChat}
                        currentUserId={
                            userInfo._id
                        }
                        onClose={() =>
                            setShowGroupInfo(
                                false
                            )
                        }
                    />
                )}
        </>
    );
};

export default ChatHeader;