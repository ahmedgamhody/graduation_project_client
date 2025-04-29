import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";
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
};
type Tdata = {
  token: string;
  refrehToken: string;
};
const actRefreshAuth = createAsyncThunk(
  "auth/actRefreshAuth",
  async (data: Tdata, thunk) => {
    const { rejectWithValue } = thunk;
    try {
      const res = await axiosInstance.post<TResponse>(
        `/authenticat/GetRefreshToken`,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actRefreshAuth;
