import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: "https://i.pravatar.cc/150",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });

      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      console.log("CSRF-token:", csrfToken);

      // console.log("Registered user:");
      // console.log("CSRF-token:", csrfToken);
      // console.log("FormData:", formData);

      const res = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            avatar: formData.avatar,
            csrfToken: csrfToken,
          }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("Username or email already exists")) {
          toast.error("Username or email already exists.");
          setError("Username or email already exists.");
          setSuccess(false);
          setTimeout(() => setError(""), 3000);
        } else {
          toast.error(data.message || "Registration failed.");
          setError(data.message || "Registration failed.");
          setSuccess(false);
          setTimeout(() => setError(""), 3000);
        }
        return;
      }

      toast.success("Registration successful! Redirecting to login....");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Registration error:", err.message);
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

          <div className="form-control">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={error ? "input-error" : success ? "input-success" : ""}
            />
            <label>Email</label>
          </div>

          <button>Sign Up To Buzz</button>
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
