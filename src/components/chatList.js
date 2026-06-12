import "../styles/chatList.css";
import SearchBar from "./searchBar";
import ChatCard from "./chatCard";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

const ChatList = () => {
    const [groupOpen, setGroupOpen] = useState(false);

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
                <ChatCard />
                <ChatCard />
                <ChatCard />
                <ChatCard />
                <ChatCard />

                <CreateGroupModal
                    open={groupOpen}
                    onClose={handleClose}
                />
            </div>
        </section>
    );
};

export default ChatList;