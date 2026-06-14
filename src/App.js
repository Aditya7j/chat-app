import AppRoutes from "./routes/AppRoutes";
import { useEffect, useContext } from "react";
import socket from "./services/socket";
import { ChatContext } from "./context/ChatContext";
import "./styles/global.css";

function App() {

  const { setOnlineUsers } =
    useContext(ChatContext);

  useEffect(() => {

    const sendSetup = () => {

      const userInfo = JSON.parse(
        localStorage.getItem(
          "userInfo"
        )
      );

      console.log(
        "USER INFO:",
        userInfo
      );

      if (userInfo) {

        socket.emit(
          "setup",
          userInfo
        );

        console.log(
          "SETUP EMITTED:",
          userInfo.name
        );
      }
    };

    const handleConnect = () => {

      console.log(
        "SOCKET CONNECTED:",
        socket.id
      );

      sendSetup();
    };

    const handleOnlineUsers = (
      users
    ) => {

      console.log(
        "ONLINE USERS RECEIVED:",
        users
      );

      setOnlineUsers(users);
    };

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "online users",
      handleOnlineUsers
    );

    if (socket.connected) {
      handleConnect();
    }

    window.addEventListener(
      "focus",
      sendSetup
    );

    return () => {

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "online users",
        handleOnlineUsers
      );

      window.removeEventListener(
        "focus",
        sendSetup
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