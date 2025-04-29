import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { LoginFormData } from "../../../validation/LoginValidation";
import axiosInstance from "../../../api/axiosInstance";

type TResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiretion: string;
  name: string;
  email: string;
  password: string;
  id: string;
};

const actAuthLogin = createAsyncThunk(
  "auth/actAuthLogin",
  async (formData: LoginFormData, thunk) => {
    const { rejectWithValue } = thunk;

    try {
      const res = await axiosInstance.post<TResponse>(
        `/authenticat/Login`,
        formData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAuthLogin;
