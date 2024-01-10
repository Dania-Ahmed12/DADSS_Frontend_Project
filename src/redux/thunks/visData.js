import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVisReport = createAsyncThunk("vis/fetch", async (search_data) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API_MARIA_DATA}/vis_data?search=${
        search_data ? search_data : ""
      }`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
  }
});
