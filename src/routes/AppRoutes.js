import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import ProtectedRoute from "./ProtectedRoutes";
import StartSplashScreen from "../components/splashScreen";

const AppRoutes = () => {
    const [showSplash, setShowSplash] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (showSplash) {
        return <StartSplashScreen onFinishedLoading={() => setShowSplash(false)} />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        userInfo
                            ? <Navigate to="/chat" replace />
                            : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        userInfo
                            ? <Navigate to="/chat" replace />
                            : <Register />
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;