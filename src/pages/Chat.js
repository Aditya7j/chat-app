import Sidebar from "../components/sidebar";
import ChatList from "../components/chatList";
import ChatWindow from "../components/chatWindow";
import { useEffect, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import api from "../services/api";
import "../styles/chat.css";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const Chat = () => {

    const {
        setChats,
        showChatWindow,
    } = useContext(ChatContext);

    const [loading, setLoading] =
        useState(true);

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
                    await api.get(
                        "/chat",
                        config
                    );

                setChats(data);

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load chats"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchChats();

    }, [setChats]);

    if (loading) {

        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#07122f",
                }}
            >
                <Oval
                    height={50}
                    width={50}
                    color="#6366f1"
                    secondaryColor="#4f46e5"
                    strokeWidth={4}
                />
            </div>
        );
    }

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