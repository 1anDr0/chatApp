import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // När användaren skriver i fälten uppdaterar vi formData
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // När man trycker "Skapa konto"
  const handleSubmit = async (e) => {
    e.preventDefault(); // stoppa sidladdning
    setError(""); // rensa gamla fel
    setSuccess(false); // släck "lyckades"-flaggan

    try {
      setSubmitting(true);

      const data = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Registration successful!");
      setSuccess(true);

      setTimeout(() => navigate("/Login"), 1000);
      return data;
    } catch (err) {
      const msg =
        err?.message === "Username or email already exists"
          ? err.message
          : err?.message || "Registration failed.";
      setError(msg);
      toast.error(msg);
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
