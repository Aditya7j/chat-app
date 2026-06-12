import "../styles/messageBubble.css";

const MessageBubble = ({ own, text }) => {
    return (
        <div
            className={`message-row ${own ? "own-message" : ""
                }`}
        >
            <div className="message-bubble">

                <p>{text}</p>

                <span className="message-time">
                    10:45 AM
                </span>

            </div>
        </div>
    );
};

export default MessageBubble;