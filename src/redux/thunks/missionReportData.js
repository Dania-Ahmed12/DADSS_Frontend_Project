import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchMissionReport = createAsyncThunk(
  "mission/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);

export const saveMissionReport = createAsyncThunk(
  "mission/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep`,
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
        data.navigation.push("/missionreport");
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

export const fetchMissionReportID = createAsyncThunk(
  "missionID/fetch",
  async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${id}`
      );
      if (response.status === 200) return response.data;
    } catch (error) {}
  }
);
