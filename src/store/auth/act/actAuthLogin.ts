import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
// import axios from "axios";
import { LoginFormData } from "../../../validation/LoginValidation";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
      const res = await axios.post<TResponse>(
        `${BASE_URL}/authenticat/Login`,
        // `${BASE_URL}/authenticat/Login`,
        formData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAuthLogin;
