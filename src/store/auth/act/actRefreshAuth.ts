import { createAsyncThunk } from "@reduxjs/toolkit";

// import axios from "axios";
import axiosErrorHandler from "../../../utils/axiosErrorHandler";

import axios from "axios";
const BASE_URL = "https://localhost:7214/api";
type TResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  name: string;
  email: string;
  refreshTokenExpiretion: string;
  password: string;
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
      const res = await axios.post<TResponse>(
        `${BASE_URL}/authenticat/GetRefreshToken`,
        data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actRefreshAuth;
