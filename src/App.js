import AppRoutes from "./routes/AppRoutes";
import { useEffect, useContext } from "react";
import socket from "./services/socket";
import { ChatContext } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";
import { Toaster } from "react-hot-toast";

function App() {
  const { setOnlineUsers } = useContext(ChatContext);

  useEffect(() => {
    const sendSetup = () => {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      if (userInfo) {
        socket.emit(
          "setup",
          userInfo
        );
      }
    };

    const handleConnect = () => {
      sendSetup();
    };

    const handleOnlineUsers = (
      users
    ) => {
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
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;