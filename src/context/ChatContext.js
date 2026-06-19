import {
    createContext,
    useEffect,
    useRef,
    useState,
} from "react";

import socket from "../services/socket";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const [chats, setChats] =
        useState([]);

    const [selectedChat, setSelectedChat] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [onlineUsers, setOnlineUsers] =
        useState([]);

    const [
        showChatWindow,
        setShowChatWindow,
    ] = useState(false);

    const selectedChatRef =
        useRef(null);

    useEffect(() => {
        selectedChatRef.current =
            selectedChat;
    }, [selectedChat]);

    useEffect(() => {

        const handleIncomingChatMessage = (
            newMessage
        ) => {

            const messageChatId =
                typeof newMessage?.chat ===
                    "object"
                    ? newMessage.chat?._id
                    : newMessage?.chat;

            if (
                !messageChatId ||
                !newMessage?._id
            ) {
                return;
            }

            setChats((previousChats) => {

                const existingChat =
                    previousChats.find(
                        (chat) =>
                            chat._id ===
                            messageChatId
                    );

                /*
                 * Prevent the same socket message
                 * from incrementing the unread
                 * count more than once.
                 */
                if (
                    existingChat?.latestMessage
                        ?._id ===
                    newMessage._id
                ) {
                    return previousChats;
                }

                const messageChat =
                    typeof newMessage.chat ===
                        "object"
                        ? newMessage.chat
                        : null;

                const chatToUpdate =
                    existingChat ||
                    messageChat;

                if (!chatToUpdate) {
                    return previousChats;
                }

                const isCurrentlyOpen =
                    selectedChatRef.current
                        ?._id ===
                    messageChatId;

                const currentUnreadCount =
                    Number(
                        chatToUpdate.unreadCount
                    ) || 0;

                const updatedChat = {
                    ...chatToUpdate,

                    latestMessage:
                        newMessage,

                    updatedAt:
                        newMessage.createdAt ||
                        new Date().toISOString(),

                    unreadCount:
                        isCurrentlyOpen
                            ? 0
                            : currentUnreadCount +
                            1,
                };

                return [
                    updatedChat,
                    ...previousChats.filter(
                        (chat) =>
                            chat._id !==
                            messageChatId
                    ),
                ];
            });
        };

        socket.on(
            "message received",
            handleIncomingChatMessage
        );

        return () => {
            socket.off(
                "message received",
                handleIncomingChatMessage
            );
        };

    }, []);

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

                showChatWindow,
                setShowChatWindow,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;