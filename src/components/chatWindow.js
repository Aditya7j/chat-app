import "../styles/chatWindow.css";

import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";

import api from "../services/api";

import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageBubble from "./messageBubble";

const ChatWindow = () => {
    const {
        selectedChat,
        messages,
        setMessages,
    } = useContext(ChatContext);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;

            try {
                const userInfo = JSON.parse(
                    localStorage.getItem("userInfo")
                );

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get(
                    `/message/${selectedChat._id}`,
                    config
                );

                setMessages(data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchMessages();
    }, [selectedChat, setMessages]);

    if (!selectedChat) {
        return (
            <section className="chat-window">
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b9bb4",
                        fontSize: "20px",
                    }}
                >
                    Select a chat to start messaging
                </div>
            </section>
        );
    }

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );

    return (
        <section className="chat-window">
            <ChatHeader />

            <div className="messages-container">

                {messages.length === 0 ? (
                    <h2
                        style={{
                            textAlign: "center",
                            marginTop: "100px",
                            color: "#8b9bb4",
                        }}
                    >
                        No messages yet
                    </h2>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            text={message.content}
                            own={
                                message.sender._id ===
                                userInfo._id
                            }
                        />
                    ))
                )}

            </div>

            <MessageInput />
        </section>
    );
};

export default ChatWindow;