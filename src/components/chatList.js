import "../styles/chatList.css";
import SearchBar from "./searchBar";
import ChatCard from "./chatCard";

const ChatList = () => {
    return (
        <section className="chat-list">

            <div className="chat-list-header">

                <h2>Messages</h2>

                <button>
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

            </div>

        </section>
    );
};

export default ChatList;