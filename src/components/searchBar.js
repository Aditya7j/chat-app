import "../styles/searchBar.css";
import { FiSearch } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import { ChatContext } from "../context/ChatContext";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const debouncedValue = useDebounce(search, 300);

    const {
        chats,
        setChats,
        setSelectedChat,
    } = useContext(ChatContext);

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    };


    useEffect(() => {
        const searchUsers = async () => {
            if (!debouncedValue.trim()) {
                setResults([]);
                return;
            }

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
                    `/user?search=${debouncedValue}`,
                    config
                );

                setResults(data);
            } catch (error) {
                console.log(error);
            }
        }
        searchUsers();
    }, [debouncedValue]);

    const accessChat = async (userId) => {
        try {
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
            console.log(error);
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

            {results.length > 0 && (
                <div className="search-results">
                    {results.map((user) => (
                        <div
                            key={user._id}
                            className="search-user"
                            onClick={()=>accessChat(user._id)}
                        >
                            <strong>{user.name}</strong>
                            <p>{user.email}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;