import "../styles/profileDrawer.css";

import {
    useContext,
    useState,
} from "react";

import api from "../services/api";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

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

    const [uploadLoading, setUploadLoading] =
        useState(false);

    const [logoutLoading, setLogoutLoading] =
        useState(false);

    const uploadImage = async (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        try {

            setUploadLoading(true);

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
                avatar: data.avatar,
            };

            localStorage.setItem(
                "userInfo",
                JSON.stringify(updatedUser)
            );

            setUser(updatedUser);

            toast.success(
                "Profile photo updated"
            );

        } catch (error) {

            toast.error(
                error.response?.data
                    ?.message ||
                "Failed to upload image"
            );

        } finally {

            setUploadLoading(false);

        }
    };

    const handleLogout = async () => {

        try {

            setLogoutLoading(true);

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

            toast.success(
                "Logged out successfully"
            );

        } catch (error) {

            toast.error(
                error.response?.data
                    ?.message ||
                "Logout failed"
            );

        } finally {

            logout();

            localStorage.removeItem(
                "userInfo"
            );

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
                    alt="profile"
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

                    {uploadLoading ? (
                        <Oval
                            height={22}
                            width={22}
                            color="#fff"
                            secondaryColor="#ffffff50"
                            strokeWidth={4}
                            visible={true}
                        />
                    ) : (
                        "Change Photo"
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={
                            uploadLoading
                        }
                        onChange={
                            uploadImage
                        }
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
                    onClick={
                        handleLogout
                    }
                    disabled={
                        logoutLoading
                    }
                >
                    {logoutLoading ? (
                        <Oval
                            height={22}
                            width={22}
                            color="#fff"
                            secondaryColor="#ffffff50"
                            strokeWidth={4}
                            visible={true}
                        />
                    ) : (
                        "Logout"
                    )}
                </button>

            </div>
        </div>
    );
};

export default ProfileDrawer;