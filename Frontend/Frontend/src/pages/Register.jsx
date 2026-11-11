import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {

    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(
                form.name,
                form.email,
                form.password
            );

            alert("Registration successful");
            navigate("/login");

        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">

            <form onSubmit={handleSubmit} className="auth-card">

                <h1>Create Account</h1>

                <input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password (minimum 8 characters)"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                    minLength={8}
                    required
                />

                <button type="submit">Register</button>

                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>

            </form>
        </div>
    );
}

export default Register;