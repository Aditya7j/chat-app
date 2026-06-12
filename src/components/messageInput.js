import "../styles/messageInput.css";
import {
    FiSend,
    FiPaperclip
} from "react-icons/fi";

const MessageInput = () => {
    return (
        <div className="message-input-wrapper">

            <input
                type="text"
                placeholder="Write a message..."
            />
            <button className="attach-btn">
                <FiPaperclip />
            </button>

            <button>
                <FiSend />
            </button>

        </div>
    );
};

export default MessageInput;