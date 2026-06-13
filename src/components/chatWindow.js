import "../styles/chatWindow.css";

import ChatHeader from "./chatHeader";
import MessageBubble from "./messageBubble";
import MessageInput from "./messageInput";

const ChatWindow = () => {
    return (
        <section className="chat-window">
            <ChatHeader />
            <div className="messages-container">
                <MessageBubble
                    text="Hey Rahul!"
                />
                <MessageBubble
                    own
                    text="Hi Aditya, how's the project going?"
                />

                <MessageBubble
                    text="Frontend UI is almost done."
                />

                <MessageBubble
                    own
                    text="Awesome. Let's finish backend tomorrow."
                />
            </div>
            <MessageInput />

        </section>
    );
};

export default ChatWindow;