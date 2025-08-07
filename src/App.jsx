import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Chat from "./components/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="Chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
