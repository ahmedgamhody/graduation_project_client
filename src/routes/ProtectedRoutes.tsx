import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CookieService from "../services/CookieService";
import actRefreshAuth from "../store/auth/act/actRefreshAuth";
import LottieHandler from "../animations/LottieHandler";
import { authLogout } from "../store/auth/authSlice";

export default function ProtectedRoutes() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  const storedToken = CookieService.getCookie("token");
  const storedRefreshToken = CookieService.getCookie("refreshToken");

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!token && storedToken && storedRefreshToken) {
        const result = await dispatch(
          actRefreshAuth({
            token: storedToken,
            refrehToken: storedRefreshToken,
          })
        );

        if (actRefreshAuth.rejected.match(result)) {
          dispatch(authLogout());
          navigate("/login", { replace: true });
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAndRefreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LottieHandler type="mainlottie" />;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
