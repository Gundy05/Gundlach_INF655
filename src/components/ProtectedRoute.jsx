import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";

function ProtectedRoute() {
  const { authReady, user } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <LoadingState fullScreen label="Checking your account..." />;
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

