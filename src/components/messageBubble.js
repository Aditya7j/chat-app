import "../styles/messageBubble.css";
import { FiCheck } from "react-icons/fi";

const MessageBubble = ({
    own,
    text,
    createdAt,
    senderName,
    isGroupChat,
    senderId,
    readBy = [],
    chatUsers = [],
}) => {

    const getSenderColor = (id) => {
        const colors = [
            "#6366f1",
            "#22c55e",
            "#f59e0b",
            "#ec4899",
            "#06b6d4",
            "#ef4444",
        ];

        const safeId = id?.toString() || "";

        let hash = 0;

        for (
            let index = 0;
            index < safeId.length;
            index++
        ) {
            hash += safeId.charCodeAt(index);
        }

        return colors[
            hash % colors.length
        ];
    };

    const getUserId = (user) => {

        if (!user) {
            return null;
        }

        if (typeof user === "object") {
            return user._id?.toString();
        }

        return user.toString();
    };

    const isMessageSeen = () => {

        if (!own) {
            return false;
        }

        const senderUserId =
            getUserId(senderId);

        const readUserIds =
            new Set(
                readBy
                    .map(getUserId)
                    .filter(Boolean)
            );

        const otherMemberIds =
            chatUsers
                .map(getUserId)
                .filter(
                    (userId) =>
                        userId &&
                        userId !==
                        senderUserId
                );

        if (
            otherMemberIds.length === 0
        ) {
            return false;
        }

        return otherMemberIds.every(
            (memberId) =>
                readUserIds.has(
                    memberId
                )
        );
    };

    const seen = isMessageSeen();

    const formattedTime =
        createdAt
            ? new Date(
                createdAt
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            )
            : "";

    return (
        <div
            className={`message-row ${own
                    ? "own-message"
                    : ""
                }`}
        >
            <div className="message-bubble">

                {isGroupChat && !own && (
                    <span
                        className="sender-name"
                        style={{
                            color:
                                getSenderColor(
                                    senderId
                                ),
                        }}
                    >
                        {senderName ||
                            "Unknown user"}
                    </span>
                )}

                <p>{text}</p>

                <div className="message-meta">

                    <span className="message-time">
                        {formattedTime}
                    </span>

                    {own && (
                        <span
                            className={`message-status ${seen
                                    ? "message-seen"
                                    : "message-unseen"
                                }`}
                            title={
                                seen
                                    ? isGroupChat
                                        ? "Seen by all members"
                                        : "Seen"
                                    : "Not seen yet"
                            }
                            aria-label={
                                seen
                                    ? "Message seen"
                                    : "Message not seen"
                            }
                        >
                            <FiCheck className="first-check" />
                            <FiCheck className="second-check" />
                        </span>
                    )}

                </div>

            </div>
        </div>
    );
};

export default MessageBubble;