import "../styles/chatHeader.css";
import {
    FiPhone,
    FiVideo,
    FiMoreVertical,
} from "react-icons/fi";

import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const ChatHeader = () => {
    const { selectedChat } =
        useContext(ChatContext);

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );

    const getChatName = () => {
        if (!selectedChat) return "";

        if (selectedChat.isGroupChat) {
            return selectedChat.chatName;
        }

        const otherUser =
            selectedChat.users.find(
                (user) =>
                    user._id !== userInfo._id
            );

        return otherUser?.name;
    };

    return (
        <div className="chat-header">
            <div className="chat-user">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        getChatName()
                    )}&background=random`}
                    alt="user"
                />

                <div>
                    <h3>{getChatName()}</h3>
                    <span>Online</span>
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