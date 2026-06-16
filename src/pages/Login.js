import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../services/api";
import socket from "../services/socket";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        try {
            setLoading(true);
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            const userData = response.data;
            localStorage.setItem(
                "userInfo",
                JSON.stringify(userData)
            );

            setUser(userData);

            socket.emit("setup", userData);

            toast.success("Login successful");

            setTimeout(() => {
                navigate("/chat");
            }, 1000);

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Invalid credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <h1>ChatTalk</h1>
                    <p>Sign in to continue chatting</p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <Oval
                                height={22}
                                width={22}
                                color="#ffffff"
                                secondaryColor="#ffffff"
                                strokeWidth={5}
                                strokeWidthSecondary={5}
                            />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;