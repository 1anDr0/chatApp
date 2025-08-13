import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      // 1. Hämta CSRF-token
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });

      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      // 2. Skicka inloggning
      const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          csrfToken: csrfToken,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Invalid credentials") {
          toast.error("Invalid username or password.");
          setError("Invalid username or password.");
          setSuccess(false);
          setTimeout(() => setError(""), 3000);
        } else {
          toast.error(data.error || "Login failed.");
          setError(data.error || "Login failed.");
          setSuccess(false);
          setTimeout(() => setError(""), 3000);
        }
        return;
      }

      // 3. Decode token
      const decoded = jwtDecode(data.token);
      const { id, username, avatar } = decoded;

      // 4. Spara i localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id, username, avatar }));

      // 5. Gå till Chat
      toast.success("Login successful!");
      setTimeout(() => {
        toast("Welcome to Buzz!", {
          style: {
            backgroundColor: "#fcd12a",
            color: "black",
          },
          closeButton: false,
          autoClose: 8000,
        });
      }, 1000);

      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/Chat"), 2000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", err.message);
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
              className={error ? "input-error" : success ? "input-success" : ""}
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
              className={error ? "input-error" : success ? "input-success" : ""}
            />
            <label>Password</label>
          </div>
          <button type="submit">Sign In To Buzz</button>

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
