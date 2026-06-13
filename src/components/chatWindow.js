import "../styles/chatWindow.css";

import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import ChatHeader from "./chatHeader";
import MessageInput from "./messageInput";

const ChatWindow = () => {
    const { selectedChat } = useContext(ChatContext);

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

    return (
        <section className="chat-window">
            <ChatHeader />

            <div className="messages-container">
                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "100px",
                        color: "#8b9bb4",
                    }}
                >
                    No messages yet
                </h2>
            </div>

            <MessageInput />
        </section>
    );
};

export default ChatWindow;