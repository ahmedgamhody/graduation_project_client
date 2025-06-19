/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deletePhoto,
  getUserProfile,
  updateUserProfile,
  uploadPhoto,
} from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
import {
  UserProfileFormData,
  userProfileSchema,
} from "../../validation/ProfileValidation";
import avatar from "../../../public/avatar.png";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import toast from "react-hot-toast";
export default function UserProfile() {
  useTitle("Profile - User Information");
  const [isNeedUpdate, setIsNeedUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [readonlyData, setReadonlyData] = useState<
    Omit<UserProfileFormData, never> & {
      country: string;
      birthDate: string;
      language: string;
      gender: string;
      photo: string | null;
    }
  >({
    country: "",
    birthDate: "",
    language: "",
    gender: "",
    photo: null,
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const nav = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isAvatar, setIsAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile(token);
        const data = res.data;
        console.log("User Data:", data);
        reset({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        });
        setProfileImagePreview(
          data.photo
            ? `https://egypt-guid26.runasp.net/images/${data.photo}`
            : avatar
        );
        setIsAvatar(data.photo === null ? true : false);
        setReadonlyData(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token, reset]);
  const handleImageDelete = async () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setReadonlyData((prev) => ({
      ...prev,
      photo: "",
    }));
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("file:", file);
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should not exceed 10MB");
        return;
      }

      setProfileImage(file);
      setIsNeedUpdate(true);
      setIsAvatar(false);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: UserProfileFormData) => {
    if (isNeedUpdate) {
      setIsLoading(true);
      if (profileImagePreview && profileImage) {
        await uploadPhoto(token, profileImage);
      }
      if (!profileImagePreview && !profileImage) {
        await deletePhoto(token);
      }
      await updateUserProfile(token, data);
      setIsLoading(false);
      nav("/");
    } else {
      setIsNeedUpdate(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-10 px-4 md:px-8 lg:px-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        My Profile
      </h2>

      {/* <div className="flex items-center justify-center mb-6">
        {readonlyData.photo ? (
          <img
            src={`https://egypt-guid26.runasp.net/images/${readonlyData.photo}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full  flex items-center justify-center">
            <img src={avatar} alt="Profile" className="w-full  rounded-full" />
          </div>
        )}
      </div> */}

      {/* Profile Picture */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative mb-4">
          {" "}
          {profileImagePreview ? (
            <div className="relative">
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
              />
              {isNeedUpdate && (
                <>
                  {!isAvatar && (
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      &times;
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      ref.current?.click();
                    }}
                    className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-purple-600 transition-colors"
                    title="Edit image"
                  >
                    ✎
                  </button>
                </>
              )}
            </div>
          ) : readonlyData.photo ? (
            <div className="relative">
              <img
                src={`https://egypt-guid26.runasp.net/images/${readonlyData.photo}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = avatar;
                }}
              />
              {isNeedUpdate && (
                <>
                  {/* زر الحذف يظهر فقط إذا كانت هناك صورة حقيقية */}
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    &times;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      ref.current?.click();
                    }}
                    className="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-purple-600 transition-colors"
                    title="Change image"
                  >
                    ✎
                  </button>
                </>
              )}
            </div>
          ) : (
            <div
              onClick={() => {
                ref.current?.click();
              }}
              className="w-32 h-32 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 text-gray-400 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-xs text-gray-500">Add Photo</p>
              </div>
            </div>
          )}{" "}
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={ref}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Editable Fields */}
        {["name", "email", "password", "phone"].map((field) => (
          <div key={field}>
            <label className="block font-medium capitalize">{field}</label>
            <input
              disabled={!isNeedUpdate}
              type={field === "password" ? "password" : "text"}
              {...register(field as keyof UserProfileFormData)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {errors[field as keyof UserProfileFormData] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field as keyof UserProfileFormData]?.message}
              </p>
            )}
          </div>
        ))}

        {/* Readonly Fields */}
        <div className="grid grid-cols-2 gap-4">
          {["Country", "Birth Date", "Language", "Gender"].map((field) => (
            <div key={field}>
              <label className="block font-medium">{field}</label>
              <input
                value={
                  field === "Birth Date"
                    ? new Date(readonlyData.birthDate).toLocaleDateString()
                    : (readonlyData as any)[field.toLowerCase()]
                }
                readOnly
                disabled
                className="w-full mt-1 px-3 py-2 border bg-gray-100 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {!isNeedUpdate && (
            <button
              type="submit"
              className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              Edit Profile
            </button>
          )}

          {isNeedUpdate && (
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          )}
          {isNeedUpdate && (
            <button
              type="button"
              onClick={() => setIsNeedUpdate(false)}
              className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
