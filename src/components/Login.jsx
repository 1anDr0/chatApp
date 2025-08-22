import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  // State (små "lådor" där vi sparar saker som ändras)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ username: "", password: "" }); // sparar vad användaren skriver i formuläret

  // När användaren skriver i input-fälten uppdaterar vi formData
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // När användaren trycker på "Sign In"
  const handleSubmit = async (e) => {
    e.preventDefault(); // hindrar webbläsarens standard-beteende (ladda om sidan)
    setError(""); // nollställ felmeddelande
    setSubmitting(true);

    try {
      // 1) logga in mot API
      const data = await loginUser({
        username: formData.username.trim(),
        password: formData.password,
      });

      // 2) API returnerar token → decoda
      const decoded = jwtDecode(data.token);

      // 3) spara auth-info i localStorage

      console.log("Login - decoded token:", decoded);

      // här får du username

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
      setTimeout(() => navigate("/Chat"), 1000);
    } catch (err) {
      const msg =
        err?.message === "Invalid credentials"
          ? "Invalid credentials"
          : err?.message || "Login failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  // === Det som ritas ut på skärmen ===
  return (
    <div>
      <nav>
        <img src="logo1.png" alt="Buzz Logo" /> {/* Logotyp */}
      </nav>
      <div className="form-wrapper">
        <h2>Sign In</h2> {/* Rubrik */}
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              name="username"
              value={formData.username} // kopplad till vårt state
              onChange={handleChange} // uppdaterar state när man skriver
              required // måste fyllas i
              autoComplete="username"
              className={error ? "input-error" : ""}
            />
            <label>Username</label>
          </div>
          <div className="form-control">
            <input
              type="password"
              name="password"
              value={formData.password} // kopplad till vårt state
              onChange={handleChange} // uppdateras när man skriver
              required // måste fyllas i
              minLength={6} // minst 6 tecken
              autoComplete="current-password"
              className={error ? "input-error" : ""}
            />
            <label>Password</label>
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Sign In To Buzz"}
          </button>
          {/* Knapp för att logga in */}
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

// Exporterar komponenten så den kan användas i App.jsx eller någon annan fil
export default Login;
