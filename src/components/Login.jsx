import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  // State (små "lådor" där vi sparar saker som ändras)
  const [success, setSuccess] = useState(false); // true/false om inlogg lyckades
  const [error, setError] = useState(""); // text för felmeddelande
  const [formData, setFormData] = useState({ username: "", password: "" }); // sparar vad användaren skriver i formuläret

  // När användaren skriver i input-fälten uppdaterar vi formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Kopierar nuvarande formData och byter ut bara det fält som ändrades (username eller password)
  };

  // När användaren trycker på "Sign In"
  const handleSubmit = async (e) => {
    e.preventDefault(); // hindrar webbläsarens standard-beteende (ladda om sidan)
    setError(""); // nollställ felmeddelande
    setSuccess(false); // sätt "lyckades" till false innan vi börjar

    try {
      // === Steg 1: Hämta CSRF-token ===
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include", // viktigt: skickar med cookies till servern
      });

      const csrfData = await csrfRes.json(); // konvertera svaret till JSON
      const csrfToken = csrfData.csrfToken; // plocka ut själva token

      // === Steg 2: Skicka inloggningsuppgifter ===
      const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
        method: "POST", // vi loggar in med POST
        headers: {
          "Content-Type": "application/json", // vi skickar JSON-data
          "X-CSRF-TOKEN": csrfToken, // skicka med CSRF-token i headern
        },
        body: JSON.stringify({
          ...formData, // användarnamn + lösenord
          csrfToken: csrfToken, // skicka också med CSRF-token i kroppen
        }),
        credentials: "include", // skickar även cookies här
      });

      const data = await res.json(); // svaret från servern (t.ex. token)

      // === Om inloggningen misslyckas ===
      if (!res.ok) {
        if (data.error === "Invalid credentials") {
          toast.error("Invalid username or password."); // visa felmeddelande i toast
          setError("Invalid username or password."); // spara felet i state
          setSuccess(false);
          setTimeout(() => setError(""), 3000); // rensa felet efter 3 sekunder
        } else {
          toast.error(data.error || "Login failed."); // visa annat felmeddelande
          setError(data.error || "Login failed.");
          setSuccess(false);
          setTimeout(() => setError(""), 3000);
        }
        return; // stoppa här (fortsätt inte med lyckad inloggning)
      }

      // === Om inloggningen lyckas ===
      const decoded = jwtDecode(data.token); // öppna token och läs innehållet
      const { id, username, avatar } = decoded; // plocka ut id, username och avatar från token

      // Spara all användardata i localStorage så vi kan vara inloggade även efter reload
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: data.token, userId: id, username, avatar })
      );

      // Visa lyckat meddelande
      toast.success("Login successful!");
      setTimeout(() => {
        toast("Welcome to Buzz!", {
          style: {
            backgroundColor: "#fcd12a", // gul bakgrund
            color: "black", // svart text
          },
          closeButton: false, // ta bort stängknappen
          autoClose: 8000, // stäng efter 8 sekunder
        });
      }, 1000);

      setSuccess(true); // markera att inloggning lyckades
      setError(""); // rensa fel

      // Vänta 2 sekunder, sen gå till chattsidan
      setTimeout(() => navigate("/chat"), 2000);
    } catch (err) {
      // Om något annat fel uppstår (t.ex. servern nere)
      toast.error("Something went wrong. Please try again.");
      console.error("Login error:", err.message); // logga felet i konsolen
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
          {" "}
          {/* Formulär som skickas när man loggar in */}
          <div className="form-control">
            <input
              type="text"
              name="username"
              value={formData.username} // kopplad till vårt state
              onChange={handleChange} // uppdaterar state när man skriver
              required // måste fyllas i
              className={error ? "input-error" : success ? "input-success" : ""} // röd/grön kant beroende på status
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
              className={error ? "input-error" : success ? "input-success" : ""} // röd/grön kant
            />
            <label>Password</label>
          </div>
          <button type="submit">Sign In To Buzz</button>{" "}
          {/* Knapp för att logga in */}
          <p className="signup-text">
            New to Buzz?{" "}
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
