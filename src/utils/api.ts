/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { UserProfileFormData } from "../validation/ProfileValidation";
import { ContactUsResponse, MachineQuestionsRequestData } from "../types";

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

export const rateTourGuide = async (
  token: string,
  tourguidId: string,
  rate: number
) => {
  const response = await axiosInstance.post(
    "/User/AddTourguidRate",
    {
      tourguidId,
      rate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success("Tourguid rated successfully!");
  return response;
};

export const getDashboardCharts = async (token: string) => {
  const response = await axiosInstance.get("/Admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updatePlaceByAdmin = async (
  token: string,
  data: {
    photo: string;
    description: string;
    visitingHours: string;
    googleRate: number;
  },
  placeName: string
) => {
  const response = await axiosInstance.put(
    `/Admin/UpdatePlace?PlaceName=${placeName}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success("Place updated successfully!");
  return response;
};

export const addPlaceByAdmin = async (
  token: string,
  data: {
    photo: string;
    description: string;
    visitingHours: string;
    googleRate: number;
    name: string;
    location: string;
    governmentName: string;
    typeOfTourism: string[];
  }
) => {
  const response = await axiosInstance.post(`/Admin/AddPlace`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  toast.success("Place added successfully!");
  return response;
};

export const deletePlaceByAdmin = async (token: string, placeName: string) => {
  const response = await axiosInstance.delete(
    `/Admin/DeletePlace?PlaceName=${placeName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
export const deleteCommentByAdmin = async (
  token: string,
  commentId: number
) => {
  const response = await axiosInstance.delete(
    `/Admin/DeleteComment?commentId=${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  toast.success("Comment deleted successfully!");

  return response;
};

export const getAllUsersProblems = async (
  token: string
): Promise<ContactUsResponse> => {
  const response = await axiosInstance.get("/Admin/ContactUsProblems", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getResolvedUserProblems = async (
  token: string
): Promise<ContactUsResponse> => {
  const response = await axiosInstance.get("/Admin/ResolvedContactUsProblems", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUserProblem = async (token: string, problemId: number) => {
  const response = await axiosInstance.delete(
    `/Admin/DeleteContactUsProblem?problemId=${problemId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  toast.success("User problem deleted successfully!");
  return response.data;
};

export const resolveUserProblem = async (
  token: string,
  contactUsId: number,
  replyMessage: string
) => {
  const response = await axiosInstance.post(
    `/Admin/ReplyToContactUs`,
    {
      contactUsId,
      replyMessage,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  toast.success("User problem resolved successfully!");
  return response.data;
};

export const deleteTripByAdmin = async (token: string, tripName: string) => {
  const response = await axiosInstance.delete(
    `/Admin/DeleteTrip?tripName=${tripName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const addTripByAdmin = async (
  token: string,
  data: {
    name: string;
    description: string;
    price: number;
    days: number;
    programName: string;
    tripsPlaces: string[];
  }
) => {
  const response = await axiosInstance.post(`/Admin/AddTrip`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  toast.success("Trip added successfully!");
  return response;
};

export const updateTripByAdmin = async (
  token: string,
  tripName: string,
  data: {
    description: string;
    price: number;
    days: number;
    programName: string;
    trips_Places: string[];
  }
) => {
  const response = await axiosInstance.put(
    `/Admin/UpdateTrip?tripName=${tripName}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  toast.success("Trip updated successfully!");
  return response;
};

export const sendMachineQuestions = async (
  data: MachineQuestionsRequestData
) => {
  const response = await axiosInstance.post(
    `${import.meta.env.VITE_BASE_URL_MACHINE_QUESTIONS}/predict_tourism_type/`,
    data
  );
  return response;
};

export const sendUserProgram = async (userid: string, program: string) => {
  const response = await axiosInstance.post(
    `MLValues/ProgramName?userid=${userid}&program=${program}`
  );
  toast.success("Your Answers sent successfully!");
  return response;
};
