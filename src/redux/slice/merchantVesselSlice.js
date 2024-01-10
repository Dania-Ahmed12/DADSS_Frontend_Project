import { createSlice } from "@reduxjs/toolkit";
import { fetchMerchantById } from "../thunks/merchantVesselData";
export const fetchMerchantVesselSlice = createSlice({
  name: "fetchMerchantVessel",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMerchantById.pending, (state) => {
        return {
          // ...state,
          data: [],
          isLoading: true,
        };
      })
      .addCase(fetchMerchantById.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchMerchantById.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase('merchant/fetch/reset', (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      })    
  },
});


