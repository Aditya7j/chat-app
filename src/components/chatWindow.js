import "../styles/chatWindow.css";
import {
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { ChatContext } from "../context/ChatContext";
import api from "../services/api";
import socket from "../services/socket";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";
import MessageBubble from "./messageBubble";
import logoImg from "../../src/assest/chat-logo.avif"

const ChatWindow = () => {
    const {
        selectedChat,
        messages,
        setMessages,
    } = useContext(ChatContext);

    const messagesEndRef = useRef(null);

    const [typing, setTyping] =
        useState(false);

    // Fetch messages when chat changes
    useEffect(() => {
        const fetchMessages = async () => {

            if (!selectedChat) return;

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
                    await api.get(
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

    // Listen for realtime messages
    useEffect(() => {

        socket.on(
            "message received",
            (newMessage) => {

                setMessages((prev) => {

                    const exists =
                        prev.some(
                            (msg) =>
                                msg._id ===
                                newMessage._id
                        );

                    if (exists)
                        return prev;

                    return [
                        ...prev,
                        newMessage,
                    ];
                });
            }
        );

        return () => {
            socket.off(
                "message received"
            );
        };

    }, [setMessages]);

    // Typing Indicator
    useEffect(() => {

        socket.on(
            "typing",
            (chatId) => {

                if (
                    selectedChat &&
                    selectedChat._id ===
                    chatId
                ) {
                    setTyping(true);
                }
            }
        );

        socket.on(
            "stop typing",
            (chatId) => {

                if (
                    selectedChat &&
                    selectedChat._id ===
                    chatId
                ) {
                    setTyping(false);
                }
            }
        );

        return () => {
            socket.off("typing");
            socket.off(
                "stop typing"
            );
        };

    }, [selectedChat]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView(
            {
                behavior: "smooth",
            }
        );
    }, [messages, typing]);

    if (!selectedChat) {
        return (
            <section className="chat-window">
                <div className="chat-inner-wrapper">
                    <img src={logoImg} alt="err" className="chat-inner-wrapper-img" />
                    <h3>Select a chat to start messaging</h3>
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
                            color: "#8b9bb4"
                        }}
                    >
                        No messages yet
                    </h2>
                ) : (
                    messages.map(
                        (message) => (
                            <MessageBubble
                                key={message._id}
                                text={message.content}
                                createdAt={message.createdAt}
                                own={message.sender._id === userInfo._id} />
                        )
                    )
                )}

                {typing && (
                    <p
                        style={{
                            color: "#8b9bb4",
                            fontSize: "14px",
                            padding: "10px"
                        }}
                    >
                        Typing...
                    </p>
                )}

                <div
                    ref={
                        messagesEndRef
                    }
                ></div>

            </div>

            <MessageInput />

        </section>
    );
};

export default ChatWindow;