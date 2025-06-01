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

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(
    `/authenticat/ForGetPassword?Email=${email}`
  );

  toast.success("Reset Code sent successfully!");

  return response;
};

export const sendOTPCode = async (code: string) => {
  const response = await axiosInstance.post(
    `/authenticat/GetCode?code=${code}`
  );
  toast.success("OTP verified successfully!");
  return response;
};

export const resetPassword = async (data: {
  email: string;
  confirmCode: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosInstance.post(`/authenticat/ResetPassword`, data);
  toast.success(
    "Password reset successfully! Please login with your new password."
  );
  return response;
};

export const sendContactUserMessage = async (
  problem: string,
  token: string
) => {
  const response = await axiosInstance.post(
    `/User/SendContactUsProblem`,
    {
      problem,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success(
    "Your message has been sent successfully! We'll get back to you soon."
  );
  return response;
};

export const setTourguidActive = async (tourguidId: string, token: string) => {
  const response = await axiosInstance.put(
    `/Admin/ActiveTourguid?TourguidId=${tourguidId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success("Tourguid activated successfully! They can now accept tours.");
  return response;
};
export const deleteTourguid = async (tourguidId: string, token: string) => {
  const response = await axiosInstance.delete(
    `/Admin/DeleteTourguid?tourguidId=${tourguidId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success("Tourguid deleted successfully!");
  return response;
};
export const setTourguidReservation = async (
  tourguidId: string,
  token: string
) => {
  const response = await axiosInstance.post(
    `/User/ReservationTourguid?tourguidId=${tourguidId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success(
    "Tourguid reservation request sent successfully! We'll notify you once it's confirmed."
  );
  return response;
};

export const cancelTourguidReservation = async (token: string) => {
  const response = await axiosInstance.delete(
    `/User/CancelReservationTourguid`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success(
    "Tourguid reservation cancelled successfully! You can request a new reservation anytime."
  );
  return response;
};
export const handleFavoriteToggleApi = async (
  token: string,
  placeName: string,
  isFavorite: boolean
) => {
  const response = await axiosInstance.post(
    `/User/AddOrRemoveFavoritePlace?PlaceName=${placeName}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (isFavorite) {
    toast.success("Place removed from favorites successfully!");
  } else {
    toast.success("Place added to favorites successfully!");
  }
  return response;
};

export const getAllFavoritePlaces = async (token: string) => {
  const response = await axiosInstance.get("/User/UserProfile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data.favoritePlaces || [];
  return data;
};
