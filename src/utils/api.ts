/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { UserProfileFormData } from "../validation/ProfileValidation";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    let message = "Something went wrong";

    if (Array.isArray(detail)) {
      message = detail.map((err: any) => err.msg).join(" | ");
    } else if (typeof detail === "string") {
      message = detail;
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export const getUserProfile = (token: string) =>
  axiosInstance.get("/User/UserProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const updateUserProfile = async (
  token: string,
  data: UserProfileFormData
) => {
  const response = await axiosInstance.put("/User/UpdateProfile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  toast.success("Profile updated successfully!");

  return response;
};

export const addComment = async (
  token: string,
  content: string,
  placeName: string
) => {
  const response = await axiosInstance.post(
    "/User/AddComment",
    {
      content,
      placeName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  toast.success("Comment added successfully!");

  return response;
};
export const deleteComment = async (token: string, commentId: number) => {
  const response = await axiosInstance.delete(
    `/User/DeleteComment?commentId=${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  toast.success("Comment deleted successfully!");

  return response;
};
export const updateComment = async (
  token: string,
  { commentId, content }: { commentId: number; content: string }
) => {
  const response = await axiosInstance.put(
    `/User/UpdateComment`,
    {
      commentId,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  toast.success("Comment updated successfully!");

  return response;
};
