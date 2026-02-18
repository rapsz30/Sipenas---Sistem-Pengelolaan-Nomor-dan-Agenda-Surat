// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import ForgotPass from './pages/ForgotPass/ForgotPass';
import ForgotUsn from './pages/ForgotUsername/ForgotUsn';
import Privacy from './pages/Privacy/Privacy'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPass />} />
         <Route path="/forgot-username" element={<ForgotUsn />} />
         <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;