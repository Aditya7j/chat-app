import "../styles/messageBubble.css";

const MessageBubble = ({ own, text, createdAt }) => {
    return (
        <div
            className={`message-row ${own ? "own-message" : ""
                }`}
        >
            <div className="message-bubble">

                <p>{text}</p>

                <span className="message-time">
                    {new Date(createdAt).toLocaleTimeString(
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