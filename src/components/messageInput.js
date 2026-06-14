import "../styles/messageInput.css";

import {
    FiSend,
    FiPaperclip,
} from "react-icons/fi";

import {
    useState,
    useContext,
} from "react";

import api from "../services/api";
import socket from "../services/socket";
import EmojiPicker from "emoji-picker-react";
import { FiSmile } from "react-icons/fi";

import {
    ChatContext,
} from "../context/ChatContext";

const MessageInput = () => {

    const [content, setContent] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const {
        selectedChat,
        setMessages,
    } = useContext(ChatContext);

    const handleTyping = (e) => {

        setContent(e.target.value);

        if (!selectedChat) return;

        socket.emit(
            "typing",
            selectedChat._id
        );

        setTimeout(() => {

            socket.emit(
                "stop typing",
                selectedChat._id
            );

        }, 1000);
    };

    const onEmojiClick = (emojiData) => {
        setContent(
            (prev) => prev + emojiData.emoji
        );

        setShowEmoji(false);
    };

    const sendMessage = async () => {

        if (!content.trim()) return;

        try {

            const userInfo = JSON.parse(
                localStorage.getItem(
                    "userInfo"
                )
            );

            const config = {
                headers: {
                    Authorization:
                        `Bearer ${userInfo.token}`,
                },
            };

            const { data } =
                await api.post(
                    "/message",
                    {
                        content,
                        chatId:
                            selectedChat._id,
                    },
                    config
                );

            setMessages((prev) => [
                ...prev,
                data,
            ]);

            socket.emit(
                "new message",
                data
            );

            setContent("");

        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (
        e
    ) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="message-input-wrapper">
            {
                showEmoji && (
                    <div className="emoji-picker">
                        <EmojiPicker
                            onEmojiClick={
                                onEmojiClick
                            }
                        />
                    </div>
                )
            }
            <input
                type="text"
                placeholder="Write a message..."
                value={content}
                onChange={handleTyping}
                onKeyDown={
                    handleKeyDown
                }
            />

            <button
                className="emoji-btn"
                onClick={() =>
                    setShowEmoji(!showEmoji)
                }
            >
                <FiSmile />
            </button>

            <button className="attach-btn">
                <FiPaperclip />
            </button>

            <button
                onClick={sendMessage}
            >
                <FiSend />
            </button>

        </div>
    );
};

export default MessageInput;