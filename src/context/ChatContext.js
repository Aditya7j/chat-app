import { createContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                selectedChat,
                setSelectedChat,
                messages,
                setMessages,
                onlineUsers,
                setOnlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;