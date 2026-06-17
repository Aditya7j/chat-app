import "../styles/messageBubble.css";

const MessageBubble = ({
    own,
    text,
    createdAt,
    senderName,
    isGroupChat,
    senderId
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

        let hash = 0;

        for (let i = 0; i < id.length; i++) {
            hash += id.charCodeAt(i);
        }

        return colors[hash % colors.length];
    };

    return (
        <div
            className={`message-row ${own ? "own-message" : ""
                }`}
        >
            <div className="message-bubble">

                {isGroupChat && !own && (
                    <span
                        className="sender-name"
                        style={{
                            color: getSenderColor(senderId),
                        }}
                    >
                        {senderName}
                    </span>
                )}

                <p>{text}</p>

                <span className="message-time">
                    {new Date(
                        createdAt
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </span>

            </div>
        </div>
    );
};

export default MessageBubble;