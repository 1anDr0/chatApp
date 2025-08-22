import "./App.css";
import "./Chat.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";

import ProtectedRoute from "./components/utils/ProtectedRoute";
import PublicRoute from "./components/utils/PublicRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Bara utloggad */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/Register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Bara inloggad */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Fångar allt annat */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer theme="colored" closeButton={false} />
    </BrowserRouter>
  );
};

export default App;
