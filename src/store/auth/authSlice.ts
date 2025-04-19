import { createSlice } from "@reduxjs/toolkit";
import actAuthRegister from "./act/actAuthRegister";
import actAuthLogin from "./act/actAuthLogin";
import { TLoading } from "../../types";
import { isString } from "../../types/guards";
import CookieService from "../../services/CookieService";
import actRefreshAuth from "./act/actRefreshAuth";
interface IAuthState {
  name: string;
  email: string;
  token: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiretion: string;
  loadingState: TLoading;
  error: string | null;
  id: string;
}

const initialState: IAuthState = {
  name: "",
  email: "",
  token: "",
  expiresIn: 0,
  refreshToken: "",
  refreshTokenExpiretion: "",
  loadingState: "idle",
  error: null,
  id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLogout: (state) => {
      state.name = "";
      state.email = "";
      state.token = "";
      state.expiresIn = 0;
      state.refreshToken = "";
      state.refreshTokenExpiretion = "";
      state.id = "";
      state.error = null;
      CookieService.removeCookie("token", { path: "/" });
      CookieService.removeCookie("refreshToken", { path: "/" });
    },
    authCleanUp: (state) => {
      state.loadingState = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /// register
    builder.addCase(actAuthRegister.pending, (state) => {
      state.loadingState = "pending";
      state.error = null;
    });
    builder.addCase(actAuthRegister.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.refreshToken = action.payload.refreshToken;
      state.id = action.payload.id;
      state.refreshTokenExpiretion = action.payload.refreshTokenExpiretion;
      CookieService.setCookie("token", action.payload.token, { path: "/" });
      CookieService.setCookie("refreshToken", action.payload.refreshToken, {
        path: "/",
      });
    });
    builder.addCase(actAuthRegister.rejected, (state, action) => {
      state.loadingState = "failed";

      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    /// login
    builder.addCase(actAuthLogin.pending, (state) => {
      state.loadingState = "pending";
      state.error = null;
    });
    builder.addCase(actAuthLogin.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.refreshToken = action.payload.refreshToken;
      state.id = action.payload.id;
      state.refreshTokenExpiretion = action.payload.refreshTokenExpiretion;
      CookieService.setCookie("token", action.payload.token, {
        path: "/",
      });
      CookieService.setCookie("refreshToken", action.payload.refreshToken, {
        path: "/",
      });
    });
    builder.addCase(actAuthLogin.rejected, (state, action) => {
      state.loadingState = "failed";
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });

    // refresh token
    builder.addCase(actRefreshAuth.pending, (state) => {
      state.loadingState = "pending";
      state.error = null;
    });
    builder.addCase(actRefreshAuth.fulfilled, (state, action) => {
      state.loadingState = "succeeded";
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.expiresIn = action.payload.expiresIn;
      state.refreshToken = action.payload.refreshToken;
      state.id = action.payload.id;
      state.refreshTokenExpiretion = action.payload.refreshTokenExpiretion;
      CookieService.setCookie("token", action.payload.token, { path: "/" });
      CookieService.setCookie("refreshToken", action.payload.refreshToken, {
        path: "/",
      });
    });
    builder.addCase(actRefreshAuth.rejected, (state, action) => {
      state.loadingState = "failed";

      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export { actAuthRegister, actAuthLogin };

export const { authLogout, authCleanUp } = authSlice.actions;
export default authSlice.reducer;
