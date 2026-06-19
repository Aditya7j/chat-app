import "../styles/chatList.css";

import SearchBar from "./searchBar";
import ChatCard from "./chatCard";
import CreateGroupModal from "./CreateGroupModal";

import {
    useContext,
    useState,
} from "react";

import { ChatContext } from "../context/ChatContext";

const ChatList = () => {

    const [
        groupOpen,
        setGroupOpen,
    ] = useState(false);

    const {
        chats,
        setChats,
        setSelectedChat,
        setShowChatWindow,
    } = useContext(ChatContext);

    const handleGroup = () => {
        setGroupOpen(true);
    };

    const handleClose = () => {
        setGroupOpen(false);
    };

    const handleSelectChat = (
        selectedChat
    ) => {

        const openedChat = {
            ...selectedChat,
            unreadCount: 0,
        };

        setChats(
            (previousChats) =>
                previousChats.map(
                    (chat) =>
                        chat._id ===
                            selectedChat._id
                            ? openedChat
                            : chat
                )
        );

        setSelectedChat(
            openedChat
        );

        if (
            window.innerWidth <= 768
        ) {
            setShowChatWindow(true);
        }
    };

    return (
        <section className="chat-list">

            <div className="chat-list-header">

                <h2>
                    Messages
                </h2>

                <button
                    type="button"
                    onClick={handleGroup}
                >
                    + Group
                </button>

            </div>

            <SearchBar />

            <div className="chat-list-body">

                {chats.length > 0 ? (

                    chats.map(
                        (chat) => (
                            <ChatCard
                                key={
                                    chat._id
                                }
                                chat={chat}
                                onClick={() =>
                                    handleSelectChat(
                                        chat
                                    )
                                }
                            />
                        )
                    )

                ) : (

                    <p className="no-chat">
                        No chats found
                    </p>

                )}

                <CreateGroupModal
                    open={groupOpen}
                    onClose={handleClose}
                />

            </div>

        </section>
    );
};

export default ChatList;