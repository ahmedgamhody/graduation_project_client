import { Navigate, Outlet } from "react-router-dom";
import CookieService from "../services/CookieService";

export default function ProtectedAuthRoutes() {
  const storedToken = CookieService.getCookie("token");
  const storedRefreshToken = CookieService.getCookie("refreshToken");

  if (storedToken && storedRefreshToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
