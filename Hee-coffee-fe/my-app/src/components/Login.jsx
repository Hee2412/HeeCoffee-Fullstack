// src/pages/Login.jsx
import s from "../styles/Login.module.scss";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import { toast } from "react-toastify";
import { saveUser } from "../utils/authUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        const { user, token } = data;

        // Use new saveUser function which handles timestamp and session
        const savedUser = saveUser(user, token);
        
        toast.success(`Welcome back, ${savedUser.name}!`);

        // Redirect logic
        const redirectTo = location.state?.redirectTo;
        
        if (savedUser.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate("/");
        }
      } else {
        console.error("Login failed:", data);
        setError(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.login_container}>
      <section className={s.login_section}>
        <p className={s.login_logo_wrapper}>
          <img
            src="/coffee/login_logo.jpg"
            className={s.login_logo}
            alt="logo"
          />
        </p>

        <form className={s.login_form} onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "15px",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                background: "#fee",
                borderRadius: "5px",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={s.login_extra}>
            <div className={s.remember_me}>
              <input type="checkbox" />
              Remember Me
            </div>
            <a href="/forgot-password" className={s.forgot_link}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className={s.btn_login} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={s.signup_link}>
            Don't have an account? <Link to="/register">Signup</Link>
          </p>
        </form>
      </section>
    </div>
  );
}