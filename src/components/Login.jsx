import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      const decoded = jwtDecode(data.token);

      console.log("Login - decoded token:", decoded);

      const authData = {
        token: data.token,
        id: decoded.id,
        username: decoded.user,
        avatar: decoded.avatar,
        email: decoded.email,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      console.log("Login- localStorage:", authData);

      toast.success("Login successful!");

      console.log("✅ Login response:", data);

      setFormData({ username: "", password: "" });

      setTimeout(() => {
        toast.success(
          `Welcome to Buzz${
            authData.username ? ", " + authData.username : ""
          }!`,
          {
            style: {
              backgroundColor: "#FCD12A",
              color: "rgb(0, 0, 0)",
            },
          }
        );
        navigate("/Chat");
      }, 1000);

      return data;
    } catch (err) {
      const msg = err?.message || "Invalid credentials";
      setError(msg);
      toast.error(msg);
      console.error("❌ Sign in:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <nav>
        <img src="logo1.png" alt="Buzz Logo" />
      </nav>
      <div className="form-wrapper">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              className={error ? "input-error" : ""}
              autoFocus
            />
            <label>Username</label>
          </div>
          <div className="form-control">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="current-password"
              className={error ? "input-error" : ""}
            />
            <label>Password</label>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Sign In To Buzz"}
          </button>

          <p className="signup-text">
            New to Buzz?
            <span className="link" onClick={() => navigate("/Register")}>
              Sign up now
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
