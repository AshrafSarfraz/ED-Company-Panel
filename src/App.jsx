import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login        from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgetPassword";
import Home         from "./pages/Home";
import Branches     from "./pages/Branches";
import BranchDetail from "./pages/BranchDetails";
import Profile      from "./pages/Profile";
import Layout       from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./pages/UpdatePassword";

const WithLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/"                    element={<Login />} />
        <Route path="/forgot-password"     element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/home"                element={<WithLayout><Home        /></WithLayout>} />
        <Route path="/branches"            element={<WithLayout><Branches    /></WithLayout>} />
        <Route path="/branches/:id/detail" element={<WithLayout><BranchDetail /></WithLayout>} />
        <Route path="/profile"             element={<WithLayout><Profile     /></WithLayout>} />
        <Route path="/update-password"  element={<WithLayout><UpdatePassword /></WithLayout>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}