import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

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

        try {
            const response = await api.post(
                "/auth/login",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            const userData = response.data;

            localStorage.setItem(
                "userInfo",
                JSON.stringify(userData)
            );

            setUser(userData);

            Swal.fire({
                icon: "success",
                title: "Welcome Back",
                text: "Login successful",
            }).then(() => {
                navigate("/chat");
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text:
                    error.response?.data?.message ||
                    "Invalid credentials",
            });
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>ChatSphere</h1>
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
                        />
                    </div>

                    <button type="submit">
                        Login
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