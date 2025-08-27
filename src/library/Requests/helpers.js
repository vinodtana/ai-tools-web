import fetch from "cross-fetch";
import moment from "moment";
import _ from "lodash";

import Axios from "axios";
import { gotoLoginPage } from "../../Scenes/common";
export const get = async function (url) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    };
    const response = await Axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (error?.response?.status == 401) {
      gotoLoginPage();
    }
    console.log("errrrrrrrr", error);
    throw new Error(error?.response?.data?.statusMessages?.[0]);
  }
};
export const put = async function (url, body = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    };
    const response = await Axios.put(url, body, { headers });
    return response.data;
  } catch (error) {
    if (error?.response?.status == 401) {
      gotoLoginPage();
    }
    throw new Error(error?.response?.data?.statusMessages?.[0]);
  }
};
export const post = async function (url, body = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    };
    const response = await Axios.post(url, body, { headers });
    return response.data;
  } catch (error) {
    if (error?.response?.status == 401) {
      gotoLoginPage();
    }
    console.log("errorerror", error);
    throw new Error(
     
      error?.response?.data?.errors?.[0]?.message ||
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.statusMessages?.[0]
      
    );
  }
};
export const del = async function (url, body = {}) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken(),
    };
    const response = await Axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    if (error?.response?.status == 401) {
      gotoLoginPage();
    }
    throw new Error(error?.response?.data?.statusMessages?.[0]);
  }
};

const getToken = () => {
  const accessToken =
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user")) &&
    JSON.parse(localStorage.getItem("user"))?.token
      ? JSON.parse(localStorage.getItem("user")).token
      : undefined;
  return accessToken;
};
