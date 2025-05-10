// من الاخر عشان اتجنب ال bug بتاعت ال public routes وانها مش بيحصل فيها refresh لل token
// ✅ التأكد من وجود توكن من الكوكيز وتجديده لو مفيش في الستور
// سواء كنت داخل على صفحة Public أو Protected.

// أول ما الأبلكيشن يفتح، AuthProvider بيشتغل علشان:

// يشوف لو فيه توكنات محفوظة في الكوكيز.

// لو مفيش في الـ Redux store لكنه لقى توكن في الكوكيز → بيجرب يجدده.

// لو التجديد فشل → بيعمل Logout + بيرميك على /login (بسبب navigate).

// لو كله تمام → بيكمل تحميل الأبلكيشن.
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
    console.log("Auth Provider start");
    const checkTokens = async () => {
      const storedToken = CookieService.getCookie("token");
      const storedRefreshToken = CookieService.getCookie("refreshToken");

      if (!token && storedToken && storedRefreshToken) {
        console.log("Refresh token");
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
  }, []);

  if (loading) return <LottieHandler type="mainlottie" />;
  return <>{children}</>;
}
