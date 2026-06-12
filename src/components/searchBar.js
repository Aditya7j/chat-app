import "../styles/searchBar.css";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
    return (
        <div className="search-container">
            <FiSearch className="search-icon" />

            <input
                type="text"
                placeholder="Search conversations..."
            />
        </div>
    );
};

export default SearchBar;