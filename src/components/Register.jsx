import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Registration successful!");
      console.log("✅ Registration response:", data);
      setFormData({ username: "", email: "", password: "" });

      setTimeout(() => navigate("/Login"), 1000);
      return data;
    } catch (err) {
      const msg = err?.message || "Registration failed.";
      setError(msg);
      toast.error(msg);
      console.error("❌ Registration error:", err);
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
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
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
              className={error ? "input-error" : ""}
            />
            <label>Password</label>
          </div>

          <div className="form-control">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={error ? "input-error" : ""}
            />
            <label>Email</label>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up To Buzz"}
          </button>

          <p>Already have an account?</p>
          <button
            id="signinhere"
            type="button"
            onClick={() => navigate("/")}
            className="signup-link"
          >
            Sign in here
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
