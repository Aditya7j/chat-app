import "../styles/groupInfoModal.css";
import {
    FiX,
    FiUsers,
    FiShield,
    FiCalendar
} from "react-icons/fi";
import {
    useEffect,
    useMemo
} from "react";

const GroupInfoModal = ({
    chat,
    currentUserId,
    onClose
}) => {

    const members = useMemo(() => {

        if (Array.isArray(chat?.users)) {
            return chat.users;
        }

        return [];

    }, [chat?.users]);

    const groupAdminId =
        typeof chat?.groupAdmin === "object"
            ? chat.groupAdmin?._id
            : chat?.groupAdmin;

    const sortedMembers = useMemo(() => {

        return [...members].sort(
            (firstMember, secondMember) => {

                const firstIsAdmin =
                    firstMember._id ===
                    groupAdminId;

                const secondIsAdmin =
                    secondMember._id ===
                    groupAdminId;

                if (
                    firstIsAdmin &&
                    !secondIsAdmin
                ) {
                    return -1;
                }

                if (
                    !firstIsAdmin &&
                    secondIsAdmin
                ) {
                    return 1;
                }

                const firstIsCurrentUser =
                    firstMember._id ===
                    currentUserId;

                const secondIsCurrentUser =
                    secondMember._id ===
                    currentUserId;

                if (
                    firstIsCurrentUser &&
                    !secondIsCurrentUser
                ) {
                    return -1;
                }

                if (
                    !firstIsCurrentUser &&
                    secondIsCurrentUser
                ) {
                    return 1;
                }

                return (
                    firstMember.name || ""
                ).localeCompare(
                    secondMember.name || ""
                );
            }
        );

    }, [
        members,
        groupAdminId,
        currentUserId
    ]);

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.body.style.overflow =
            "hidden";

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

            document.body.style.overflow =
                "";
        };

    }, [onClose]);

    const getAvatarUrl = (user) => {

        if (user?.avatar) {

            if (
                user.avatar.startsWith(
                    "http"
                )
            ) {
                return user.avatar;
            }

            return `http://localhost:5000${user.avatar}`;
        }

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
        )}&background=random`;
    };

    const getGroupAvatar = () => {

        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            chat?.chatName || "Group"
        )}&background=random&size=160`;
    };

    const getCreatedDate = () => {

        if (!chat?.createdAt) {
            return "";
        }

        return new Date(
            chat.createdAt
        ).toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    const handleOverlayClick = (
        event
    ) => {

        if (
            event.target ===
            event.currentTarget
        ) {
            onClose();
        }
    };

    return (
        <div
            className="group-info-overlay"
            onMouseDown={
                handleOverlayClick
            }
        >
            <div
                className="group-info-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="group-info-title"
            >
                <div className="group-info-header">

                    <div>
                        <h2 id="group-info-title">
                            Group information
                        </h2>

                        <p>
                            View group details and members
                        </p>
                    </div>

                    <button
                        type="button"
                        className="group-info-close"
                        onClick={onClose}
                        aria-label="Close group information"
                    >
                        <FiX />
                    </button>

                </div>

                <div className="group-info-profile">

                    <img
                        src={getGroupAvatar()}
                        alt={
                            chat?.chatName ||
                            "Group"
                        }
                    />

                    <h3>
                        {chat?.chatName}
                    </h3>

                    <div className="group-info-member-count">
                        <FiUsers />

                        <span>
                            {members.length}{" "}
                            {members.length === 1
                                ? "member"
                                : "members"}
                        </span>
                    </div>

                </div>

                {chat?.createdAt && (
                    <div className="group-created-date">
                        <FiCalendar />

                        <span>
                            Created on{" "}
                            {getCreatedDate()}
                        </span>
                    </div>
                )}

                <div className="group-members-section">

                    <div className="group-members-heading">

                        <h4>
                            Members
                        </h4>

                        <span>
                            {members.length}
                        </span>

                    </div>

                    <div className="group-members-list">

                        {sortedMembers.map(
                            (member) => {

                                const isAdmin =
                                    member._id ===
                                    groupAdminId;

                                const isCurrentUser =
                                    member._id ===
                                    currentUserId;

                                return (
                                    <div
                                        className="group-member-item"
                                        key={member._id}
                                    >
                                        <img
                                            src={getAvatarUrl(
                                                member
                                            )}
                                            alt={
                                                member.name ||
                                                "Member"
                                            }
                                        />

                                        <div className="group-member-details">

                                            <div className="group-member-name-row">

                                                <h5>
                                                    {member.name}

                                                    {isCurrentUser &&
                                                        " (You)"}
                                                </h5>

                                                {isAdmin && (
                                                    <span className="admin-badge">
                                                        <FiShield />
                                                        Admin
                                                    </span>
                                                )}

                                            </div>

                                            <p>
                                                {member.email}
                                            </p>

                                        </div>
                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

                <div className="group-info-footer">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
};

export default GroupInfoModal;