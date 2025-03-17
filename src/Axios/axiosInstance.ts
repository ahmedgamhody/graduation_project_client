import axios from "axios";
import { authLogout, authRefreshSuccess } from "../store/auth/authSlice"; // لا تستورد store هنا مباشرة

const api = axios.create({
  baseURL: "https://localhost:7214/api",
});

// قائمة انتظار للطلبات التي يتم تعليقها حتى يتم تحديث التوكن
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// إضافة Interceptor لطلبات الـ API
api.interceptors.request.use(
  async (config) => {
    const { store } = await import("../store/store"); // ✅ استدعاء Lazy لتجنب المشكلة
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor لمعالجة الأخطاء وتجديد التوكن
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { store } = await import("../store/store"); // ✅ استدعاء Lazy هنا أيضًا
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!refreshToken) {
        store.dispatch(authLogout());
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          "https://localhost:7214/api/authenticat/GetRefreshToken",
          {
            token: state.auth.token,
            refrehToken: refreshToken,
          }
        );

        const newTokenData = response.data;
        store.dispatch(authRefreshSuccess(newTokenData));

        isRefreshing = false;
        onRefreshed(newTokenData.token);

        originalRequest.headers.Authorization = `Bearer ${newTokenData.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        store.dispatch(authLogout());
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
