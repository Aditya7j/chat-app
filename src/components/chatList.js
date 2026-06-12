import "../styles/chatList.css";
import SearchBar from "./searchBar";
import ChatCard from "./chatCard";
import { useState, useContext } from "react";
import CreateGroupModal from "./CreateGroupModal";
import { ChatContext } from "../context/ChatContext";

const ChatList = () => {
    const [groupOpen, setGroupOpen] = useState(false);

    const { chats, setSelectedChat } = useContext(ChatContext);

    const handleGroup = () => {
        setGroupOpen(true);
    };

    const handleClose = () => {
        setGroupOpen(false);
    };

    return (
        <section className="chat-list">
            <div className="chat-list-header">
                <h2>Messages</h2>

                <button onClick={handleGroup}>
                    + Group
                </button>
            </div>

            <SearchBar />

            <div className="chat-list-body">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <ChatCard
                            key={chat._id}
                            chat={chat}
                            onClick={() =>
                                setSelectedChat(chat)
                            }
                        />
                    ))
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