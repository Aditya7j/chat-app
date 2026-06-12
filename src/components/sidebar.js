import "../styles/sidebar.css";

import {
    FiMessageSquare,
    FiUsers,
    FiSettings,
    FiHome,
} from "react-icons/fi";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                
            </div>

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
            </div>

            <div className="sidebar-profile">
                <img
                    src="https://i.pravatar.cc/150?img=8"
                    alt="profile"
                />
            </div>
        </aside>
    );
};

export default Sidebar;