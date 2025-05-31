import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import UnauthorizedPage from "../pages/errors pages/UnauthorizedPage";
interface ProtectedRoutesProps {
  allowedRoles: string[];
}

export default function ProtectedRoutes({
  allowedRoles,
}: ProtectedRoutesProps) {
  const { token, role } = useAppSelector((state) => state.auth);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    return <UnauthorizedPage />;
  }
  return <Outlet />;
}
