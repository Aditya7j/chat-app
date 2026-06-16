import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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

        if (loading) return;

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            toast.error(
                "Passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/auth/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password:
                        formData.password,
                }
            );

            toast.success(
                "Registration successful!"
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">
                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join ChatTalk today
                    </p>
                </div>

                <form
                    className="register-form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="form-group">
                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your name"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Create password"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Confirm password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <Oval
                                height={22}
                                width={22}
                                color="#fff"
                                secondaryColor="#fff"
                                strokeWidth={4}
                                strokeWidthSecondary={4}
                                visible={true}
                            />
                        ) : (
                            "Register"
                        )}
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