import "../styles/messageInput.css";

import {
    FiSend,
    FiPaperclip,
    FiSmile,
} from "react-icons/fi";

import {
    useState,
    useContext,
} from "react";

import api from "../services/api";
import socket from "../services/socket";
import EmojiPicker from "emoji-picker-react";
import { Oval } from "react-loader-spinner";
import toast from "react-hot-toast";

import {
    ChatContext,
} from "../context/ChatContext";

const MessageInput = () => {

    const [content, setContent] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [sending, setSending] = useState(false);

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

            setSending(true);

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

            toast.error(
                error.response?.data
                    ?.message ||
                "Failed to send message"
            );

        } finally {

            setSending(false);

        }
    };

    const handleKeyDown = (
        e
    ) => {

        if (
            e.key === "Enter" &&
            !sending
        ) {
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
                onKeyDown={handleKeyDown}
                disabled={sending}
            />

            <button
                className="emoji-btn"
                onClick={() =>
                    setShowEmoji(!showEmoji)
                }
                disabled={sending}
            >
                <FiSmile />
            </button>

            <button
                className="attach-btn"
                disabled={sending}
            >
                <FiPaperclip />
            </button>

            <button
                onClick={sendMessage}
                disabled={sending}
            >
                {sending ? (
                    <Oval
                        height={18}
                        width={18}
                        color="#fff"
                        secondaryColor="#fff"
                        strokeWidth={4}
                        visible={true}
                    />
                ) : (
                    <FiSend />
                )}
            </button>

        </div>
    );
};

export default MessageInput;