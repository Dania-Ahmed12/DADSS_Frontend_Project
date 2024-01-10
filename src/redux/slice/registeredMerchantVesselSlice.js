import { createSlice } from "@reduxjs/toolkit";
import {
  fetchRegisteredMerchantVessel,
  saveRegistedMerchantVessel,
} from "../thunks/registerMerchantVesselDatas";

export const fetchRegisteredMerchantVesselSlice = createSlice({
  name: "fetchRegisteredMerchantVesselData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredMerchantVessel.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchRegisteredMerchantVessel.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchRegisteredMerchantVessel.rejected, (state, action) => {
        const errorMessage = action.payload?.response?.data?.error || "Unknown error";
        return {
          ...state,
          isLoading: false,
          // error: action.payload,
          error: errorMessage,
        };
      });
  },
});

export const saveRegisteredMerchantVesselSlice = createSlice({
  name: "saveRegisteredMerchantVesselData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveRegistedMerchantVessel.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(saveRegistedMerchantVessel.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(saveRegistedMerchantVessel.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
