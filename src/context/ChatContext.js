import { createContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);

    return (
        <ChatContext.Provider
            value={{ chats, setChats, selectedChat, setSelectedChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;