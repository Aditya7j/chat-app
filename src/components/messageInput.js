import "../styles/messageInput.css";
import {
    FiSend,
    FiPaperclip
} from "react-icons/fi";

import { useState, useContext } from "react";

import api from "../services/api";
import { ChatContext } from "../context/ChatContext";

const MessageInput = () => {

    const [content, setContent] = useState("");

    const {
        selectedChat,
        messages,
        setMessages,
    } = useContext(ChatContext);

    const sendMessage = async () => {

        if (!content.trim()) return;

        try {

            const userInfo = JSON.parse(
                localStorage.getItem("userInfo")
            );

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await api.post(
                "/message",
                {
                    content,
                    chatId: selectedChat._id,
                },
                config
            );

            setMessages([
                ...messages,
                data,
            ]);

            setContent("");

        } catch (error) {
            console.log(error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="message-input-wrapper">

            <input
                type="text"
                placeholder="Write a message..."
                value={content}
                onChange={(e) =>
                    setContent(e.target.value)
                }
                onKeyDown={handleKeyDown}
            />

            <button className="attach-btn">
                <FiPaperclip />
            </button>

            <button onClick={sendMessage}>
                <FiSend />
            </button>

        </div>
    );
};

export default MessageInput;