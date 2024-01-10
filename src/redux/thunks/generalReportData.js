import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchGeneralReport = createAsyncThunk(
  "general/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/greport?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
    }
  }
);

export const saveGeneralReport = createAsyncThunk(
  "general/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/greport`,
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
        data.navigation.push("/generalreport");
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

export const fetchGeneralReportById = createAsyncThunk(
  "general/fetchId",
  async (key) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/greport/${key}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
    }
  }
);
