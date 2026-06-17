import "../styles/sidebar.css";
import { FiMessageSquare, FiUsers, FiSettings, FiHome, FiSun, FiMoon } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileDrawer from "./ProfileDrawer";
import { ThemeContext } from "../context/ThemeContext";

const Sidebar = () => {

    const { user } = useContext(AuthContext);
    const [openProfile, setOpenProfile] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-logo"></div>
                <div className="sidebar-menu">
                    <button className="menu-btn active">
                        <FiHome />
                    </button>

                    <button className="menu-btn">
                        <FiMessageSquare />
                    </button>

                    <button className="menu-btn">
                        <FiUsers />
                    </button>

                    <button className="menu-btn">
                        <FiSettings />
                    </button>

                    <button
                        className="menu-btn"
                        onClick={toggleTheme}
                    >
                        {theme === "dark"
                            ? <FiSun />
                            : <FiMoon />}
                    </button>

                </div>

                <div
                    className="sidebar-profile"
                    onClick={() => setOpenProfile(true)}>
                    <img
                        src={
                            user?.avatar
                                ? `http://localhost:5000${user.avatar}`
                                : "https://i.pravatar.cc/150?img=2"
                        }
                        alt="profile"
                    />
                </div>
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