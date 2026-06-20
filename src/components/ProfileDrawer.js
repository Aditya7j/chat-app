import "../styles/profileDrawer.css";

import {
    useContext,
    useState,
} from "react";

import api from "../services/api";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

import { AuthContext } from "../context/AuthContext";

const SERVER_URL =
    process.env.REACT_APP_SOCKET_URL ||
    "http://localhost:5000";

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

    const uploadImage = async (event) => {

        const file =
            event.target.files[0];

        if (!file) return;

        try {

            setUploadLoading(true);

            const formData =
                new FormData();

            formData.append(
                "avatar",
                file
            );

            const storedUserInfo =
                localStorage.getItem(
                    "userInfo"
                );

            if (!storedUserInfo) {
                toast.error(
                    "Please login again"
                );

                return;
            }

            const userInfo =
                JSON.parse(
                    storedUserInfo
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
                JSON.stringify(
                    updatedUser
                )
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

            event.target.value = "";
        }
    };

    const handleLogout = async () => {

        try {

            setLogoutLoading(true);

            const storedUserInfo =
                localStorage.getItem(
                    "userInfo"
                );

            if (storedUserInfo) {

                const userInfo =
                    JSON.parse(
                        storedUserInfo
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
            }

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
                    type="button"
                    className="close-btn"
                    onClick={onClose}
                    aria-label="Close profile"
                >
                    ✕
                </button>

                <img
                    src={getProfileImageUrl()}
                    alt="profile"
                />

                <h2>
                    {user?.name}
                </h2>

                <p>
                    {user?.email}
                </p>

                <label className="upload-btn">

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
                    type="button"
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