import { createAsyncThunk } from "@reduxjs/toolkit";

// import axios from "axios";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
import { UserRegisterFormData } from "../../../validation/RegisterValidation";
import axiosInstance from "../../../api/axiosInstance";
type TResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  name: string;
  email: string;
  refreshTokenExpiretion: string;
  password: string;
  id: string;
  role: string;
};
const actAuthRegister = createAsyncThunk(
  "auth/actAuthRegister",
  async (formData: UserRegisterFormData, thunk) => {
    const { rejectWithValue } = thunk;
    try {
      const res = await axiosInstance.post<TResponse>(
        `/authenticat/Register`,
        formData
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actAuthRegister;
