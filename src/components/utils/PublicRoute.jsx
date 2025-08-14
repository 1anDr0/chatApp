import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return auth?.token ? <Navigate to="/chat" replace /> : children;
};

export default PublicRoute;
