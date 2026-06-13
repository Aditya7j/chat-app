import "../styles/searchBar.css";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useDebounce } from "../hooks/useDebounce";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const debouncedValue = useDebounce(search, 300);

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
    }, [debouncedValue])


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