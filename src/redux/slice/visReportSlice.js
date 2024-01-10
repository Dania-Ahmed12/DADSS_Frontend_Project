import { createSlice } from "@reduxjs/toolkit";
import { fetchVisReport } from "../thunks/visData";

export const fetchVisReportSlice = createSlice({
  name: "fetchVisData",
  initialState: {
    isLoading: false,
    data: [],
    error: "",
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisReport.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchVisReport.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          data: action.payload,
          error: "",
        };
      })
      .addCase(fetchVisReport.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
      });
  },
});
