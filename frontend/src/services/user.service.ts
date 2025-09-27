import axiosIntance from "@/services/interceptor";
import { UserType } from "@/@types/user.type";

export const createUser = async (user: UserType) => {
  try {
    const response = await axiosIntance.post(`/users`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await axiosIntance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id: string, user: UserType) => {
  try {
    const response = await axiosIntance.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const storeUserID = (id: string) => {
  localStorage.setItem("userID", id);
};

export const getStoredUserID = () => {
  return localStorage.getItem("userID");
};

export const removeStoredUserID = () => {
  localStorage.removeItem("userID");
};
