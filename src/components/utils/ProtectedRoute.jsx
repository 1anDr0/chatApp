import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");

  return auth?.token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
