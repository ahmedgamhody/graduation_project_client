import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

export default function ProtectedAuthRoutes() {
  const { token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(-1); // يرجع المستخدم خطوة للخلف
    }
  }, [token, navigate]);

  return <Outlet />;
}
