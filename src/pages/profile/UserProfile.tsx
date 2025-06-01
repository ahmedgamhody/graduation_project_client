/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserProfile, updateUserProfile } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
import {
  UserProfileFormData,
  userProfileSchema,
} from "../../validation/ProfileValidation";
import avatar from "../../../public/avatar.png";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile(token);
        const data = res.data;
        reset({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        });
        setReadonlyData(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token, reset]);

  const onSubmit = async (data: UserProfileFormData) => {
    if (isNeedUpdate) {
      setIsLoading(true);
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

      <div className="flex items-center justify-center mb-6">
        {readonlyData.photo ? (
          <img
            src={readonlyData.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full  flex items-center justify-center">
            <img src={avatar} alt="Profile" className="w-full  rounded-full" />
          </div>
        )}
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
