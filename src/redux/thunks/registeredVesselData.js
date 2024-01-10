import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const fetchRegisteredVessel = createAsyncThunk(
  "registered/fetch",
  async (search_data) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel?search=${
          search_data ? search_data : ""
        }`
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      return "error";
    }
  }
);

export const saveRegistedVessel = createAsyncThunk(
  "registered/post",
  async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel`,
        data
      );
      if (response.status === 200 || response.status === 201)
         toast.success(`Vessel Data saved`, {
           position: "top-right",
           autoClose: 1000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "dark",
         });
      sessionStorage.removeItem("formData");
      sessionStorage.removeItem("OwnerForm");
      return response.data;
    } catch (error) {
      toast.success(`Error , Please Try Again`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
);
