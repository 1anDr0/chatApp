import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    avatar: "https://i.pravatar.cc/150",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });

      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      console.log("🟢 Registrerar användare med:");
      console.log("CSRF-token:", csrfToken);
      console.log("FormData:", formData);

      const res = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("Username or email already exists")) {
          setError("Användarnamn eller e-post används redan.");
        } else {
          setError(data.message || "Registreringen misslyckades.");
        }
        return;
      }

      // Allt gick bra – visa meddelande och skicka till login
      setSuccess("Registrering lyckades! Skickar dig till inloggning...");
      setTimeout(() => navigate("/login"), 2000); // Redirect efter 2 sek
    } catch (err) {
      setError("Något gick fel. Försök igen.");
      console.error("Registrering fel:", err.message);
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
            />
            <label>Email</label>
          </div>

          {/* Visar felmeddelande */}
          {error && <p className="error">{error}</p>}

          {/* Visar bekräftelse */}
          {success && <p className="success">{success}</p>}

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
