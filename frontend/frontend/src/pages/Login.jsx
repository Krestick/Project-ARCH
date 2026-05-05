import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notification";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                notifyError(data.error || "Login failed");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            dispatch(login(data.user));

            notifySuccess("Login successful!");
            navigate("/");

        } catch {
            notifyError("Server error");
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} disabled={isLoading} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} disabled={isLoading} />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>

            <Link to="/" className="back-btn">
                ← Back to Home
            </Link>
        </div>
    );
}

export default Login;