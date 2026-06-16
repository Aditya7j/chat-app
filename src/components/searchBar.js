import "../styles/searchBar.css";
import { FiSearch } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import { ChatContext } from "../context/ChatContext";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(null);

    const debouncedValue = useDebounce(search, 300);

    const {
        chats,
        setChats,
        setSelectedChat,
    } = useContext(ChatContext);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        const searchUsers = async () => {
            if (!debouncedValue.trim()) {
                setResults([]);
                return;
            }

            try {
                setSearchLoading(true);

                const userInfo = JSON.parse(
                    localStorage.getItem("userInfo")
                );

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get(
                    `/user?search=${debouncedValue}`,
                    config
                );

                setResults(data);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to search users"
                );
            } finally {
                setSearchLoading(false);
            }
        };

        searchUsers();
    }, [debouncedValue]);

    const accessChat = async (userId) => {
        try {
            setChatLoading(userId);

            const userInfo = JSON.parse(
                localStorage.getItem("userInfo")
            );

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await api.post(
                "/chat",
                { userId },
                config
            );

            const chatExists = chats.find(
                (chat) => chat._id === data._id
            );

            if (!chatExists) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);

            setSearch("");
            setResults([]);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to open chat"
            );
        } finally {
            setChatLoading(null);
        }
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <FiSearch className="search-icon" />

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {(searchLoading || results.length > 0) && (
                <div className="search-results">

                    {searchLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "20px",
                            }}
                        >
                            <Oval
                                height={24}
                                width={24}
                                color="#6366f1"
                                secondaryColor="#6366f1"
                                strokeWidth={4}
                            />
                        </div>
                    ) : (
                        results.map((user) => (
                            <div
                                key={user._id}
                                className="search-user"
                                onClick={() =>
                                    !chatLoading &&
                                    accessChat(user._id)
                                }
                            >
                                <strong>{user.name}</strong>

                                <p>
                                    {chatLoading === user._id ? (
                                        <Oval
                                            height={16}
                                            width={16}
                                            color="#6366f1"
                                            secondaryColor="#6366f1"
                                            strokeWidth={5}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;