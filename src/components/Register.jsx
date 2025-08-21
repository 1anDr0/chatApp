import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  // State-lådor för status och fel
  const [success, setSuccess] = useState(false); // true om registrering lyckats
  const [error, setError] = useState(""); // text för felmeddelanden

  // State-låda för formuläret (det användaren skriver)
  const [formData, setFormData] = useState({
    username: "", // användarnamn
    email: "", // e-post
    password: "", // lösenord
    confirmPassword: "", // bekräfta lösenord (klientkontroll)
  });

  // När användaren skriver i fälten uppdaterar vi formData
  const handleChange = (e) => {
    setFormData({
      ...formData, // kopiera det gamla
      [e.target.name]: e.target.value, // ersätt fältet som ändrades
    });
  };

  // När man trycker "Skapa konto"
  const handleSubmit = async (e) => {
    e.preventDefault(); // stoppa sidladdning
    setError(""); // rensa gamla fel
    setSuccess(false); // släck "lyckades"-flaggan

    try {
      // === Steg 1: Hämta CSRF-token (skyddslapp) ===
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH", // enligt serverns krav
        credentials: "include", // skicka cookies
      });

      const csrfData = await csrfRes.json(); // gör om till JSON
      const csrfToken = csrfData.csrfToken; // plocka ut token-strängen

      // console.log("Registered user:");
      // console.log("CSRF-token:", csrfToken);
      // console.log("FormData:", formData);

      const res = await fetch(
        "https://chatify-api.up.railway.app/auth/register",
        {
          method: "POST", // registrering sker med POST
          headers: {
            "Content-Type": "application/json", // vi skickar JSON
            "X-CSRF-TOKEN": csrfToken, // lägg token i header
          },
          body: JSON.stringify({
            username: formData.username, // det användaren skrev
            email: formData.email,
            password: formData.password,
            csrfToken, // skicka även i body (vanligt i denna uppgift)
          }),
          credentials: "include", // skicka cookies här också
        }
      );

      const data = await res.json(); // serverns svar

      // console.log("🔍 Response from register API:", data);

      if (!res.ok) {
        // API:et kan svara med "Username or email already exists"
        // eller annat felmeddelande. Visa snyggt och spara i state.
        const message =
          data?.error === "Username or email already exists"
            ? "Username or email already exists"
            : data?.error || "Registration failed.";
        setError(message); // spara felet så vi kan färga inputs
        toast.error(message); // pling med fel
        return; // stoppa här
      }

      // === Om det gick bra ===
      toast.success("Registration successful!"); // visa glad pling
      setSuccess(true); // sätt grön status
      setError(""); // rensa fel
      // console.log("✅ Registration OK:", data);

      // Liten försening för att låta användaren se plinget, sedan gå till Login
      setTimeout(() => navigate("/Login"), 1200); // byt till din login-rutt om annan
    } catch (err) {
      // Nätverksfel/oväntat fel
      console.error("Registration error:", err?.message || err);
      toast.error("Something went wrong. Please try again."); // pling med fel
      setError("Something went wrong. Please try again."); // spara fel
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
