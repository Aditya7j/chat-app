import AppRoutes from "./routes/AppRoutes";
import { useEffect, useContext } from "react";
import socket from "./services/socket";
import { ChatContext } from "./context/ChatContext";
import "./styles/global.css";

function App() {

  const { setOnlineUsers } =
    useContext(ChatContext);

  useEffect(() => {

    const userInfo = JSON.parse(
      localStorage.getItem(
        "userInfo"
      )
    );

    if (userInfo) {
      socket.emit(
        "setup",
        userInfo
      );
    }

    socket.on(
      "online users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    return () => {
      socket.off(
        "online users"
      );
    };

  }, [setOnlineUsers]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;