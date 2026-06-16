import Sidebar from "../components/sidebar";
import ChatList from "../components/chatList";
import ChatWindow from "../components/chatWindow";
import { useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import api from "../services/api";
import "../styles/chat.css";

const Chat = () => {

    const {
        setChats,
        showChatWindow,
    } = useContext(ChatContext);

    useEffect(() => {

        const fetchChats = async () => {

            try {

                const userInfo = JSON.parse(
                    localStorage.getItem("userInfo")
                );

                const config = {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                };

                const { data } =
                    await api.get("/chat", config);

                setChats(data);

            } catch (error) {

                console.log(error);

            }
        };

        fetchChats();

    }, [setChats]);

    return (
        <div className="chat-page">

            <Sidebar />

            <div
                className={`chat-list-wrapper ${showChatWindow
                        ? "hide-mobile"
                        : ""
                    }`}
            >
                <ChatList />
            </div>

            <div
                className={`chat-window-wrapper ${showChatWindow
                        ? "show-mobile"
                        : ""
                    }`}
            >
                <ChatWindow />
            </div>

        </div>
    );
};

export default Chat;