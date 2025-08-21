import { Navigate } from "react-router-dom";
// Vi lånar ett verktyg som kan "skicka" dig till en annan sida.

const ProtectedRoute = ({ children }) => {
  // Vi bygger en dörrvakt som heter ProtectedRoute.
  // "children" = det hemliga rummet (sidan) vi vill visa om du får komma in.

  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  // Titta i webbläsarens lilla ryggsäck (localStorage) och hämta lappen "auth".
  // Om lappen inte finns får vi null (inget). Då använder vi texten "null" så JSON.parse inte kraschar.
  // JSON.parse gör om texten till ett riktigt objekt (så vi kan läsa auth.token).

  return auth?.token ? children : <Navigate to="/" replace />;
  // Kolla: Finns auth OCH en biljett (token)? (auth?.token = säker koll, funkar även om auth är null)
  // JA -> visa rummet (children).
  // NEJ -> skicka hem till "/" med Navigate.
  // "replace" betyder: byt ut historiken så bakåt-knappen inte tar dig in igen.
};

export default ProtectedRoute;
// Gör så andra filer kan använda vår dörrvakt.
