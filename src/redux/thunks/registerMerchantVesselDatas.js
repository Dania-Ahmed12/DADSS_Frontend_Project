import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchRegisteredMerchantVessel = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      return "error";
    }
  }
);

export const saveRegistedMerchantVessel = createAsyncThunk(
  "registered/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel`,
        data
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
      if (error.response.data) {
        toast.error(` Error : ${error.response.data.error}`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
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
  }
);
