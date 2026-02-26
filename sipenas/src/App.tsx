import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; 
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPass/ForgotPass";
import ForgotUsername from "./pages/ForgotUsername/ForgotUsn";
import Privacy from "./pages/Privacy/Privacy";
import Help from "./pages/Help/Help";
import DashboardOperator from "./pages/Operator/DashboardOperator";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import AjukanSuratOperator from "./pages/Operator/AjukanSuratOperator";
import ForgotPassword1 from "./pages/ForgotPass/ForgotPass1";
import AturPeriode from "./pages/Admin/AturPeriode";
import KelolaSurat from "./pages/Admin/KelolaSurat";
import FAQ from "./pages/Help/FAQ/FAQ";
import Guide from "./pages/Help/Guide/Guide";
import Contact from "./pages/Help/Contact/Contact";
import Updates from "./pages/Help/Updates/Updates";
import DaftarPeriode from "./pages/Admin/DaftarPeriode";
import ForceChangePassword from "./pages/ForceChangePassword/ForceChangePassword";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-username" element={<ForgotUsername />} />
          <Route path="/forgot-password1" element={<ForgotPassword1 />} />
        </Route>
        <Route path="/help" element={<Help />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/force-change-password" element={<ForceChangePassword />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/atur-periode" element={<AturPeriode />} />
          <Route path="/kelola-surat" element={<KelolaSurat />} />
          <Route path="/daftar-periode" element={<DaftarPeriode />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["operator"]} />}>
          <Route path="/operator" element={<DashboardOperator />} />
          <Route path="/ajukan-surat" element={<AjukanSuratOperator />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;