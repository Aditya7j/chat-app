import "../styles/profileDrawer.css";

const ProfileDrawer = () => {
    return (
        <div className="profile-drawer">

            <img
                src="https://i.pravatar.cc/150?img=15"
                alt=""
            />

            <h2>Rahul Sharma</h2>
            <p>Frontend Developer</p>

            <div className="profile-section">
                Shared Media
            </div>

            <div className="profile-section">
                Groups
            </div>

            <div className="profile-section">
                Files
            </div>

        </div>
    );
};

export default ProfileDrawer;