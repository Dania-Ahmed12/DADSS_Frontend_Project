import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchMerchantById = createAsyncThunk(
  "merchant/fetch",
  async (key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/${key}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const fetchMerchantData = createAsyncThunk(
  "merchantReport/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      }
    } catch (error) {}
  }
);

export const saveMerchantVessel = createAsyncThunk(
  "merchant/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant`,
        data.data
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(`Data Save Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return response.data;
      }
    } catch (error) {
      toast.error(`Upload failed. Please try again.`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
);
