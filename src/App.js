import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import socket from "./services/socket";
import "./styles/global.css";

function App() {
  useEffect(() => {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (userInfo) {
      socket.emit("setup", userInfo);
    }

    socket.on("connected", () => {
      console.log("Socket Ready");
    });

  }, []);

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
