import "../styles/searchBar.css";
import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import api from "../services/api";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const value = e.target.value;

        setSearch(value);

        if (!value.trim()) {
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
                `/user?search=${value}`,
                config
            );

            setResults(data);
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