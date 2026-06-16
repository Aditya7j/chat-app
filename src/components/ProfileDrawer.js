import "../styles/profileDrawer.css";

import {
    useContext,
    useState,
} from "react";

import api from "../services/api";

import { AuthContext } from "../context/AuthContext";

const ProfileDrawer = ({
    open,
    onClose,
}) => {

    const {
        user,
        setUser,
        logout,
    } = useContext(AuthContext);

    const [loading, setLoading] =
        useState(false);

    const uploadImage = async (
        e
    ) => {

        const file =
            e.target.files[0];

        if (!file) return;

        try {

            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "avatar",
                file
            );

            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        "userInfo"
                    )
                );

            const { data } =
                await api.post(
                    "/user/upload-avatar",
                    formData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${userInfo.token}`,
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

            const updatedUser = {
                ...userInfo,
                avatar:
                    data.avatar,
            };

            localStorage.setItem(
                "userInfo",
                JSON.stringify(
                    updatedUser
                )
            );

            setUser(
                updatedUser
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    const handleLogout = async () => {

        try {

            const userInfo =
                JSON.parse(
                    localStorage.getItem(
                        "userInfo"
                    )
                );

            await api.post(
                "/auth/logout",
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${userInfo.token}`,
                    },
                }
            );

        } catch (error) {
            console.log(error);
        } finally {
            logout();
            window.location.href = "/";
        }
    };

    if (!open) return null;

    return (
        <div
            className={`profile-overlay ${open ? "active" : ""
                }`}
        >
            <div className="profile-drawer">

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <img
                    src={
                        user?.avatar
                            ? `http://localhost:5000${user.avatar}`
                            : "https://i.pravatar.cc/150?img=2"
                    }
                    alt=""
                />

                <h2>
                    {user?.name}
                </h2>

                <p>
                    {user?.email}
                </p>

                <label
                    className="upload-btn"
                >
                    {
                        loading
                            ? "Uploading..."
                            : "Change Photo"
                    }

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={uploadImage}
                    />
                </label>

                <div className="profile-section">
                    Shared Media
                </div>

                <div className="profile-section">
                    Groups
                </div>

                <div className="profile-section">
                    Files
                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>
        </div>
    );
};

export default ProfileDrawer;