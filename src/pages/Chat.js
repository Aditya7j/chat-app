import Sidebar from "../components/sidebar";
import ChatList from "../components/chatList";
import ChatWindow from "../components/chatWindow";

const Chat = () => {
    return (
        <div
            style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <ChatList />
            <ChatWindow />
        </div>
    );
};

export default Chat;