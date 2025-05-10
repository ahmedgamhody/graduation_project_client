import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoutes() {
  const { token } = useAppSelector((state) => state.auth);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
