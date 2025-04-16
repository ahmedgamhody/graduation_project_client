/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import registerLogo from "../../assets/login.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  RegisterFormData,
  RegisterSchema,
} from "../../validation/RegisterValidation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthRegister, authCleanUp } from "../../store/auth/authSlice";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const { error, loadingState, token } = useAppSelector((state) => state.auth);
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("Register Data:", data);
    try {
      const result = await dispatch(actAuthRegister(data)).unwrap();

      if (result.token) {
        toast.success(`Registration successful! Welcome ${result.name}`);
        nav("/");
      } else {
        toast.error("Registration failed. Please check your details.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again!");
      console.error("Error registering user:", error);
    }
  };

  // get countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countries = response.data.map(
          (country: any) => country.name.common
        );
        setCountries(countries);
      } catch (error) {
        toast.error("Failed to load countries. Please try again!");
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // clean up loading and error messages form slice
    return () => {
      dispatch(authCleanUp());
    };
  }, [dispatch]);
  if (token) return <Navigate to="/" replace />;
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img
          src={registerLogo}
          alt="Register Logo"
          className="mx-auto block w-24 md:w-32 lg:w-48 mb-4"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
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
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Country</label>
            <select
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            >
              <option value="">Select a country</option>
              {countries?.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Age </label>
            <input
              type="number"
              {...register("age")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700">Gender</label>
            <select
              {...register("gender")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>

          <button
            disabled={loadingState === "pending"}
            type="submit"
            className={`w-full  bg-primary text-white py-2 rounded-md hover:bg-secondary transition flex items-center justify-center ${
              loadingState === "pending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingState === "pending" ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                Registering...
              </>
            ) : (
              "Register"
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

export default RegisterPage;
