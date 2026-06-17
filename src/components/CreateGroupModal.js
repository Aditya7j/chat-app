import "../styles/createGroupModal.css";
import { FiX } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { useDebounce } from "../hooks/useDebounce";
import api from "../services/api";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

const CreateGroupModal = ({ open, onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    const {
        chats,
        setChats,
        setSelectedChat,
    } = useContext(ChatContext);

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
    );

    useEffect(() => {
        const searchUsers = async () => {
            if (!debouncedSearch.trim()) {
                setResults([]);
                return;
            }

            try {
                setSearchLoading(true);

                const { data } = await api.get(
                    `/user?search=${debouncedSearch}`,
                    {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );

                setResults(data);
            } catch (error) {
                toast.error("Failed to search users");
            } finally {
                setSearchLoading(false);
            }
        };

        searchUsers();
    }, [debouncedSearch, userInfo.token]);

    const addUser = (user) => {
        const exists = selectedUsers.find(
            (u) => u._id === user._id
        );

        if (exists) {
            toast.error("User already added");
            return;
        }

        setSelectedUsers([
            ...selectedUsers,
            user,
        ]);

        setSearch("");
        setResults([]);
    };

    const removeUser = (userId) => {
        setSelectedUsers(
            selectedUsers.filter(
                (user) => user._id !== userId
            )
        );
    };

    const createGroup = async () => {
        if (!groupName.trim()) {
            return toast.error(
                "Please enter group name"
            );
        }

        if (selectedUsers.length < 2) {
            return toast.error(
                "Select atleast 2 users"
            );
        }

        try {
            setLoading(true);

            const { data } = await api.post(
                "/chat/group",
                {
                    chatName: groupName,
                    users: selectedUsers.map(
                        (user) => user._id
                    ),
                },
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            setChats([data, ...chats]);
            setSelectedChat(data);

            toast.success(
                "Group created successfully"
            );

            setGroupName("");
            setSearch("");
            setResults([]);
            setSelectedUsers([]);

            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create group"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="group-modal">
                <div className="modal-header">
                    <h2>Create Group</h2>

                    <button onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">

                    <input
                        type="text"
                        placeholder="Group Name"
                        value={groupName}
                        onChange={(e) =>
                            setGroupName(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="text"
                        placeholder="Search Users"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    {searchLoading && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Oval
                                height={22}
                                width={22}
                                color="#6366f1"
                                secondaryColor="#6366f1"
                            />
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="group-search-results">

                            {results.map((user) => (
                                <div
                                    key={user._id}
                                    className="group-search-user"
                                    onClick={() =>
                                        addUser(user)
                                    }
                                >
                                    <strong>
                                        {user.name}
                                    </strong>

                                    <p>
                                        {user.email}
                                    </p>
                                </div>
                            ))}

                        </div>
                    )}

                    <div className="selected-users">

                        {selectedUsers.map(
                            (user) => (
                                <span
                                    key={user._id}
                                    onClick={() =>
                                        removeUser(
                                            user._id
                                        )
                                    }
                                >
                                    {user.name} ✕
                                </span>
                            )
                        )}

                    </div>

                    <button
                        className="create-group-btn"
                        onClick={createGroup}
                        disabled={loading}
                    >
                        {loading ? (
                            <Oval
                                height={20}
                                width={20}
                                color="#ffffff"
                                secondaryColor="#ffffff"
                            />
                        ) : (
                            "Create Group"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;