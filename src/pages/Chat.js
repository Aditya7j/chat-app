import Sidebar from "../components/sidebar";
import ChatList from "../components/chatList";
import ChatWindow from "../components/chatWindow";
import { useEffect, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import api from "../services/api";

const Chat = () => {
    const { setChats } = useContext(ChatContext);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userInfo = JSON.parse(
                    localStorage.getItem("userInfo")
                );

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get(
                    "/chat",
                    config
                );

                console.log("chat data",data)
                setChats(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchChats();
    }, [setChats]);


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