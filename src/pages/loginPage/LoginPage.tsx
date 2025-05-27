import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginFormData, LoginSchema } from "../../validation/LoginValidation";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { actAuthLogin, authCleanUp } from "../../store/auth/authSlice";
import useTitle from "../../hooks/useChangePageTitle";
import { AppRoutes } from "../../constants/enums";

const Login = () => {
  useTitle("Login");
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { loadingState, token } = useAppSelector((state) => state.auth);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(actAuthLogin(data)).unwrap();

      if (result.token) {
        toast.success(`Login successful! Welcome back ${result.name}`);
        nav(AppRoutes.ROOT, { replace: true });
      } else {
        toast.error("Invalid login credentials.");
      }
    } catch (error) {
      toast.error("Login failed. Invalid login credentials. Please try again.");
      console.error("Error logging in user:", error);
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img
          src="/main_logo.png"
          alt="Main Logo"
          className="mx-auto block w-24 md:w-32 lg:w-42 mb-4"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
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

          <div className="flex justify-between items-center mb-4">
            <Link
              to={AppRoutes.FORGOT_PASSWORD}
              className="text-purple-700 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loadingState === "pending" || !isValid}
            className={`w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed ${
              loadingState === "pending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingState === "pending" ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Don't have an account?{" "}
          <Link
            to={AppRoutes.REGISTER}
            className="text-purple-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
