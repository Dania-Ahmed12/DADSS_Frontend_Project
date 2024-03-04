import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchAllPlatformData = createAsyncThunk(
  "data/fetch",
  async (search_data) => {
    try {

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform?search=${
          search_data ? search_data : ""
        }`,
      
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const addPlatformData = createAsyncThunk("data/entry", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
      data
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Data added Successfully");
      return response.data;
    }
  } catch (error) {
    toast.error(error?.response?.data);
  }
});
