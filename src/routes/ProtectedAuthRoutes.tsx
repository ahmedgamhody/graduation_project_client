import { Navigate, Outlet } from "react-router-dom";
import CookieService from "../services/CookieService";
import { useAppSelector } from "../store/hooks";

export default function ProtectedAuthRoutes() {
  const { token } = useAppSelector((state) => state.auth);
  const storedToken = CookieService.getCookie("token");
  const storedRefreshToken = CookieService.getCookie("refreshToken");

  if ((storedToken && storedRefreshToken) || token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
