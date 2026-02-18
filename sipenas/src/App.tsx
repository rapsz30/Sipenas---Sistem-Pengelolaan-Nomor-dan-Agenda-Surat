import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPass/ForgotPass";
import ForgotUsername from "./pages/ForgotUsername/ForgotUsn";
import Privacy from "./pages/Privacy/Privacy";
import Help from "./pages/Help/Help";

// Import CSS Global
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
        </Route>
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
