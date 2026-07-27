import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("companyToken");
  const user  = localStorage.getItem("companyUser");

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
}