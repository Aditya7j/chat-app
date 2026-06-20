import { io } from "socket.io-client";

const SOCKET_URL =
    process.env.REACT_APP_SOCKET_URL ||
    "http://localhost:5000";

const socket = io(
    SOCKET_URL,
    {
        transports: [
            "websocket",
        ],
        reconnection: true,
        reconnectionAttempts:
            Infinity,
        reconnectionDelay: 1000,
    }
);

export default socket;