import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";
import Swal from "sweetalert2";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match",
            });
            return;
        }

        try {
            const response = await api.post(
                "/auth/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }
            );

            console.log(response.data);

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Registration successful!",
            }).then(() => {
                navigate("/");
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text:
                    error.response?.data?.message ||
                    "Something went wrong",
            });
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h1>Create Account</h1>
                    <p>Join ChatSphere today</p>
                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </div>

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
                            placeholder="Create password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        Register
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?
                        <Link to="/">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;