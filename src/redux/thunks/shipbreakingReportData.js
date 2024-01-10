import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchShipBreakingReport = createAsyncThunk(
  "shipbreak/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
    }
  }
);

export const saveShipBreakingReport = createAsyncThunk(
  "shipbreak/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking`,
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
        sessionStorage.removeItem("shipBreakingForm");
        sessionStorage.removeItem("crewForm");
        sessionStorage.removeItem("crewData");
        data.navigation.push("/shipbreaking");
        return response.data;
      }
    } catch (error) {
      if (error.response.data) {
        toast.error(`Upload failed. Please try again `, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        throw error;
      }
    }
  }
);
