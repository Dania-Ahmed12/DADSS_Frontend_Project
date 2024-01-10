import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchFishingById = createAsyncThunk(
  "fishing/fetch",
  async (key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/rvkey/${key}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const saveFishingVessel = createAsyncThunk(
  "fishing/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing`,
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
        toast.error(`Error . Please try again.`, {
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
