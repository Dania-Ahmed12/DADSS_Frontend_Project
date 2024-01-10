import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const loginApi = createAsyncThunk("login/post", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/login`,
      data?.validatedValues
    );
    if (response.status === 200) {
      const {
        token,
        username,
        u_userid,
        category,
        u_pf_id,
        is_superuser,
        // u_owner,
        // u_create_user,
        // u_access_rvdata,
        // u_crew,
        // u_goods,
        // u_access_form,
      } = response.data;
      Cookies.set("token", token);
      Cookies.set("username", username);
      Cookies.set("userId", u_userid);
      Cookies.set("category", category);
      Cookies.set("u_pf_id", u_pf_id);
      Cookies.set("is_superuser", is_superuser);
      // Cookies.set("u_view_map", u_view_map);
      // Cookies.set("u_create_user", u_create_user);
      // Cookies.set("u_access_rvdata", u_access_rvdata);
      // Cookies.set("u_crew", u_crew);
      // Cookies.set("u_goods", u_goods);
      // Cookies.set("u_owner", u_owner);
      // Cookies.set("u_access_form", u_access_form);
      // toast.success("Success");
        toast.success(`Login Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      data?.router?.push("/dashboard");
      return response.data;
    }
  } catch (error) {
    toast.error(`${error.response.data.details}`, {
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
});

export const registerApi = createAsyncThunk("register/post", async (data) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/register`,
      data
    );
    if (response.status === 200) return response.data;
  } catch (error) {
  }
});
export const getAllUsers = createAsyncThunk("users/fetch", async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/user`
    );
    if (response.status === 200) return response.data;
  } catch (error) {
  }
});
