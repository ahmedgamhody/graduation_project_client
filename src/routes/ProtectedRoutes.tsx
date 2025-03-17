import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CookieService from "../services/CookieService";
import actRefreshAuth from "../store/auth/act/actRefreshAuth";

export default function ProtectedRoutes() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const storedToken = CookieService.getCookie("token");
  const storedRefreshToken = CookieService.getCookie("refreshToken");

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!token && storedToken && storedRefreshToken) {
        await dispatch(
          actRefreshAuth({
            token: storedToken,
            refrehToken: storedRefreshToken,
          })
        );
      }
      setLoading(false);
    };

    checkAndRefreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!storedToken && !storedRefreshToken)
    return <Navigate to="/login" replace />;
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
