import { createSlice } from "@reduxjs/toolkit";
import { loginApi, registerApi, getAllUsers } from "../thunks/userAuth";
import Cookies from "js-cookie";
export const loginSlice = createSlice({
  name: "loginAuth",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
    isLoggedIn: Cookies.get("token")!== null &&
    Cookies.get("token") !== undefined &&
    Cookies.get("token") !== "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginApi.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
          isLoggedIn: true,
        };
      })
      .addCase(loginApi.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      })
  },
});
export const registerSlice = createSlice({
  name: "register",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerApi.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(registerApi.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(registerApi.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      })
  },
});
export const getAllUsersSlice = createSlice({
  name: "getUsers",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
          isLoggedIn: false,
        };
      })
  },
});



