import { createSlice } from "@reduxjs/toolkit";
import { fetchFishingById } from "../thunks/fishingVesselData";
export const fetchFishingVesselSlice = createSlice({
  name: "fetchFishingVessel",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFishingById.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchFishingById.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchFishingById.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      })
      .addCase("fishing/fetch/reset", (state, action) => {
        return {
          isLoading: false,
          data: [],
          error: "",
        };
      });
  },
});
