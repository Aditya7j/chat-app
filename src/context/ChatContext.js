import { createContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    return (
        <ChatContext.Provider
            value={{
                chats,
                setChats,
                selectedChat,
                setSelectedChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;