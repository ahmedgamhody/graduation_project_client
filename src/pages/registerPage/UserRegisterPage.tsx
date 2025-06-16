/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  UserRegisterFormData,
  UserRegisterSchema,
} from "../../validation/RegisterValidation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthRegister, authCleanUp } from "../../store/auth/authSlice";
import { countries, languages } from ".";
import useTitle from "../../hooks/useChangePageTitle";

const UserRegisterPage = () => {
  useTitle("Register - Visitor");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loadingState, token } = useAppSelector((state) => state.auth);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(UserRegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UserRegisterFormData) => {
    try {
      const result = await dispatch(actAuthRegister(data)).unwrap();

      if (result.token) {
        toast.success(`Registration successful! Welcome ${result.name}`);
        nav("/machine-quotations", { state: { user: data } });
      } else {
        toast.error("Registration failed. Please check your details.");
      }
    } catch (error: any) {
      toast.error(`Registration failed , ${error?.errors[1]}`);
      console.error("Error registering user:", error);
      if (error?.response?.data?.errors) {
        setErrorMessage(error?.errors[1]);
      }
    }
  };

  useEffect(() => {
    // clean up loading and error messages form slice
    return () => {
      dispatch(authCleanUp());
    };
  }, [dispatch]);
  if (token) return <Navigate to="/" replace />;
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <img
          src="/main_logo.png"
          alt="Register Logo"
          className="mx-auto block w-24 md:w-32 lg:w-28 mb-4"
        />
        <h1 className="text-2xl font-semibold mb-4 text-center text-secondary">
          Register as Visitor
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 mt-6">
            <div className="w-full">
              <div className="mb-3">
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option className="hidden">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-3">
                <label className="block text-gray-700">Country</label>
                <select
                  {...register("country")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option className="hidden">Select a country</option>
                  {countries?.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  inputMode="tel"
                  {...register("phone")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Birth Date</label>
                <input
                  type="date"
                  {...register("birthDate")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm">
                    {errors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-gray-700">Language</label>
                <select
                  {...register("language")}
                  className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option className="hidden">Select a Language</option>
                  {languages?.map((language) => (
                    <option key={language.name} value={language.name}>
                      {language.name} {`(${language.code})`}
                    </option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-red-500 text-sm">
                    {errors.language.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={loadingState === "pending" || !isValid}
            type="submit"
            className={`w-full  bg-primary text-white py-2 rounded-md hover:bg-secondary transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed mt-4 ${
              loadingState === "pending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingState === "pending" ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                Registering...
              </>
            ) : (
              "Register as Visitor"
            )}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegisterPage;
