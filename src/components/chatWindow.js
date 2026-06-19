import "../styles/chatWindow.css";
import {
    useCallback,
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
import logoImg from "../../src/assest/logo.png";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const getUserInfo = () => {
    const storedUserInfo =
        localStorage.getItem("userInfo");

    if (!storedUserInfo) {
        return null;
    }

    try {
        return JSON.parse(storedUserInfo);
    } catch (error) {
        return null;
    }
};

const getId = (item) => {
    if (!item) {
        return null;
    }

    if (typeof item === "object") {
        return item._id?.toString();
    }

    return item.toString();
};

const addUserToReadBy = (
    readBy,
    userId
) => {
    const currentReadBy =
        Array.isArray(readBy)
            ? readBy
            : [];

    const normalizedUserId =
        getId(userId);

    if (!normalizedUserId) {
        return currentReadBy;
    }

    const hasAlreadyRead =
        currentReadBy.some(
            (reader) =>
                getId(reader) ===
                normalizedUserId
        );

    if (hasAlreadyRead) {
        return currentReadBy;
    }

    return [
        ...currentReadBy,
        userId,
    ];
};

const ChatWindow = () => {
    const {
        selectedChat,
        messages,
        setMessages,
        setChats,
    } = useContext(ChatContext);

    const messagesContainerRef =
        useRef(null);

    const messagesEndRef =
        useRef(null);

    const [typing, setTyping] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const scrollToBottom =
        useCallback(
            (behavior = "smooth") => {
                const container =
                    messagesContainerRef.current;

                if (container) {
                    container.scrollTo({
                        top:
                            container.scrollHeight,
                        behavior,
                    });

                    return;
                }

                messagesEndRef.current
                    ?.scrollIntoView({
                        behavior,
                        block: "end",
                    });
            },
            []
        );

    const markMessagesAsRead =
        useCallback(
            async (chatId) => {
                if (!chatId) {
                    return;
                }

                const userInfo =
                    getUserInfo();

                if (
                    !userInfo?.token ||
                    !userInfo?._id
                ) {
                    return;
                }

                try {
                    const config = {
                        headers: {
                            Authorization:
                                `Bearer ${userInfo.token}`,
                        },
                    };

                    const { data } =
                        await api.put(
                            `/message/read/${chatId}`,
                            {},
                            config
                        );

                    setChats(
                        (previousChats) =>
                            previousChats.map(
                                (chat) =>
                                    chat._id ===
                                        chatId
                                        ? {
                                            ...chat,
                                            unreadCount: 0,
                                        }
                                        : chat
                            )
                    );

                    const messageIds =
                        Array.isArray(
                            data?.messageIds
                        )
                            ? data.messageIds.map(
                                (messageId) =>
                                    messageId.toString()
                            )
                            : [];

                    if (
                        messageIds.length === 0
                    ) {
                        return;
                    }

                    setMessages(
                        (previousMessages) =>
                            previousMessages.map(
                                (message) => {
                                    const isUpdated =
                                        messageIds.includes(
                                            message._id.toString()
                                        );

                                    if (!isUpdated) {
                                        return message;
                                    }

                                    return {
                                        ...message,
                                        readBy:
                                            addUserToReadBy(
                                                message.readBy,
                                                userInfo._id
                                            ),
                                    };
                                }
                            )
                    );

                    socket.emit(
                        "mark messages read",
                        {
                            chatId,
                            messageIds,
                        }
                    );

                } catch (error) {
                    console.error(
                        "Failed to mark messages as read:",
                        error?.response
                            ?.data?.message ||
                        error.message
                    );
                }
            },
            [
                setChats,
                setMessages,
            ]
        );

    useEffect(() => {
        const fetchMessages =
            async () => {
                if (
                    !selectedChat?._id
                ) {
                    return;
                }

                try {
                    setLoading(true);

                    const userInfo =
                        getUserInfo();

                    if (
                        !userInfo?.token
                    ) {
                        toast.error(
                            "Please login again"
                        );

                        return;
                    }

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

                    setMessages(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                    await markMessagesAsRead(
                        selectedChat._id
                    );

                } catch (error) {
                    toast.error(
                        error?.response
                            ?.data?.message ||
                        "Failed to load messages"
                    );

                } finally {
                    setLoading(false);
                }
            };

        fetchMessages();

    }, [
        selectedChat,
        setMessages,
        markMessagesAsRead,
    ]);

    useEffect(() => {
        const handleMessageReceived =
            async (newMessage) => {
                const incomingChatId =
                    typeof newMessage?.chat ===
                        "object"
                        ? newMessage.chat?._id
                        : newMessage?.chat;

                if (
                    !selectedChat?._id ||
                    incomingChatId?.toString() !==
                    selectedChat._id.toString()
                ) {
                    return;
                }

                setMessages(
                    (previousMessages) => {
                        const exists =
                            previousMessages.some(
                                (message) =>
                                    message._id ===
                                    newMessage._id
                            );

                        if (exists) {
                            return previousMessages;
                        }

                        return [
                            ...previousMessages,
                            newMessage,
                        ];
                    }
                );

                setTyping(false);

                await markMessagesAsRead(
                    selectedChat._id
                );
            };

        socket.on(
            "message received",
            handleMessageReceived
        );

        return () => {
            socket.off(
                "message received",
                handleMessageReceived
            );
        };

    }, [
        selectedChat,
        setMessages,
        markMessagesAsRead,
    ]);

    useEffect(() => {
        const handleMessagesRead = (
            readData
        ) => {
            const {
                chatId,
                messageIds,
                readByUserId,
            } = readData || {};

            if (
                !selectedChat?._id ||
                selectedChat._id.toString() !==
                chatId?.toString() ||
                !Array.isArray(messageIds) ||
                !readByUserId
            ) {
                return;
            }

            const normalizedMessageIds =
                messageIds.map(
                    (messageId) =>
                        messageId.toString()
                );

            setMessages(
                (previousMessages) =>
                    previousMessages.map(
                        (message) => {
                            const isUpdated =
                                normalizedMessageIds.includes(
                                    message._id.toString()
                                );

                            if (!isUpdated) {
                                return message;
                            }

                            return {
                                ...message,
                                readBy:
                                    addUserToReadBy(
                                        message.readBy,
                                        readByUserId
                                    ),
                            };
                        }
                    )
            );
        };

        socket.on(
            "messages read",
            handleMessagesRead
        );

        return () => {
            socket.off(
                "messages read",
                handleMessagesRead
            );
        };

    }, [
        selectedChat,
        setMessages,
    ]);

    useEffect(() => {
        const handleTyping = (
            chatId
        ) => {
            if (
                selectedChat?._id
                    ?.toString() ===
                chatId?.toString()
            ) {
                setTyping(true);
            }
        };

        const handleStopTyping = (
            chatId
        ) => {
            if (
                selectedChat?._id
                    ?.toString() ===
                chatId?.toString()
            ) {
                setTyping(false);
            }
        };

        socket.on(
            "typing",
            handleTyping
        );

        socket.on(
            "stop typing",
            handleStopTyping
        );

        return () => {
            socket.off(
                "typing",
                handleTyping
            );

            socket.off(
                "stop typing",
                handleStopTyping
            );
        };

    }, [selectedChat]);

    const lastMessageId =
        messages.length > 0
            ? messages[
                messages.length - 1
            ]?._id
            : null;

    useEffect(() => {
        if (loading) {
            return;
        }

        const animationFrame =
            window.requestAnimationFrame(
                () => {
                    scrollToBottom(
                        "smooth"
                    );
                }
            );

        return () => {
            window.cancelAnimationFrame(
                animationFrame
            );
        };

    }, [
        selectedChat?._id,
        lastMessageId,
        messages.length,
        typing,
        loading,
        scrollToBottom,
    ]);

    if (!selectedChat) {
        return (
            <section className="chat-window">
                <div className="chat-inner-wrapper">
                    <img
                        src={logoImg}
                        alt="logo"
                        className="chat-inner-wrapper-img"
                    />

                    <h3>
                        Select a chat to start messaging
                    </h3>
                </div>
            </section>
        );
    }

    const userInfo =
        getUserInfo();

    return (
        <section className="chat-window">

            <ChatHeader />

            <div
                className="messages-container"
                ref={
                    messagesContainerRef
                }
            >

                {loading ? (

                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            height: "100%",
                        }}
                    >
                        <Oval
                            height={40}
                            width={40}
                            color="#6366f1"
                            secondaryColor="#6366f1"
                            strokeWidth={4}
                        />
                    </div>

                ) : messages.length === 0 ? (

                    <h2
                        style={{
                            textAlign:
                                "center",
                            marginTop:
                                "200px",
                            color:
                                "#8b9bb4",
                        }}
                    >
                        No messages yet
                    </h2>

                ) : (

                    messages.map(
                        (message) => {
                            const senderId =
                                getId(
                                    message.sender
                                );

                            return (
                                <MessageBubble
                                    key={
                                        message._id
                                    }
                                    text={
                                        message.content
                                    }
                                    createdAt={
                                        message.createdAt
                                    }
                                    own={
                                        senderId ===
                                        userInfo?._id
                                            ?.toString()
                                    }
                                    senderName={
                                        typeof message.sender ===
                                            "object"
                                            ? message.sender
                                                ?.name
                                            : ""
                                    }
                                    senderId={
                                        senderId
                                    }
                                    isGroupChat={
                                        selectedChat
                                            .isGroupChat
                                    }
                                    readBy={
                                        message.readBy ||
                                        []
                                    }
                                    chatUsers={
                                        selectedChat.users ||
                                        []
                                    }
                                />
                            );
                        }
                    )
                )}

                {typing && (
                    <p
                        style={{
                            color:
                                "#8b9bb4",
                            fontSize:
                                "14px",
                            padding:
                                "10px",
                        }}
                    >
                        Typing...
                    </p>
                )}

                <div
                    ref={messagesEndRef}
                />

            </div>

            <MessageInput />

        </section>
    );
};

export default ChatWindow;