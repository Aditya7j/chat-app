import "../styles/chatHeader.css";
import { FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";

const ChatHeader = () => {
    return (
        <div className="chat-header">
            <div className="chat-user">
                <img
                    src="https://i.pravatar.cc/150?img=15"
                    alt="user"
                />

                <div>
                    <h3>Rahul Sharma</h3>
                    <span>Online</span>
                </div>
            </div>

            <div className="chat-actions">
                <button>
                    <FiPhone />
                </button>

                <button>
                    <FiVideo />
                </button>

                <button>
                    <FiMoreVertical />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;