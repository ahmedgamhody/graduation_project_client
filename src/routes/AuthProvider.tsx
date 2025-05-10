import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CookieService from "../services/CookieService";
import actRefreshAuth from "../store/auth/act/actRefreshAuth";
import { authLogout } from "../store/auth/authSlice";
import LottieHandler from "../animations/LottieHandler";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkTokens = async () => {
      const storedToken = CookieService.getCookie("token");
      const storedRefreshToken = CookieService.getCookie("refreshToken");

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
        }
      }
      setLoading(false);
    };

    checkTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LottieHandler type="mainlottie" />;
  return <>{children}</>;
}
