import "../styles/sidebar.css";

import {
    FiMessageSquare,
    FiUsers,
    FiSettings,
    FiHome,
    FiSun,
    FiMoon,
} from "react-icons/fi";

import {
    useContext,
    useState,
} from "react";

import { AuthContext } from "../context/AuthContext";
import ProfileDrawer from "./ProfileDrawer";
import { ThemeContext } from "../context/ThemeContext";

const SERVER_URL =
    process.env.REACT_APP_SOCKET_URL ||
    "http://localhost:5000";

const Sidebar = () => {

    const { user } =
        useContext(AuthContext);

    const {
        theme,
        toggleTheme,
    } = useContext(ThemeContext);

    const [
        openProfile,
        setOpenProfile,
    ] = useState(false);

    const getProfileImageUrl = () => {

        if (!user?.avatar) {
            return "https://i.pravatar.cc/150?img=2";
        }

        if (
            user.avatar.startsWith("http")
        ) {
            return user.avatar;
        }

        return `${SERVER_URL}${user.avatar}`;
    };

    return (
        <>
            <aside className="sidebar">

                <div className="sidebar-logo"></div>

                <div className="sidebar-menu">

                    <button
                        type="button"
                        className="menu-btn active"
                        aria-label="Home"
                    >
                        <FiHome />
                    </button>

                    <button
                        type="button"
                        className="menu-btn"
                        aria-label="Messages"
                    >
                        <FiMessageSquare />
                    </button>

                    <button
                        type="button"
                        className="menu-btn"
                        aria-label="Users"
                    >
                        <FiUsers />
                    </button>

                    <button
                        type="button"
                        className="menu-btn"
                        aria-label="Settings"
                    >
                        <FiSettings />
                    </button>

                    <button
                        type="button"
                        className="menu-btn"
                        onClick={toggleTheme}
                        aria-label={
                            theme === "dark"
                                ? "Switch to light theme"
                                : "Switch to dark theme"
                        }
                    >
                        {theme === "dark"
                            ? <FiSun />
                            : <FiMoon />}
                    </button>

                </div>

                <button
                    type="button"
                    className="sidebar-profile"
                    onClick={() =>
                        setOpenProfile(true)
                    }
                    aria-label="Open profile"
                >
                    <img
                        src={getProfileImageUrl()}
                        alt={
                            user?.name
                                ? `${user.name} profile`
                                : "Profile"
                        }
                    />
                </button>

            </aside>

            <ProfileDrawer
                open={openProfile}
                onClose={() =>
                    setOpenProfile(false)
                }
            />
        </>
    );
};

export default Sidebar;