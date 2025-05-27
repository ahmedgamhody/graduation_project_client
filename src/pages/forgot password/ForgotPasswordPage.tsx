import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AppRoutes } from "../../constants/enums";
import { useState } from "react";
import {
  ForgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../../validation/ForgotPasswordValidation";
import { forgotPassword } from "../../utils/api";

export default function ForgotPasswordPage() {
  useTitle("Forgot Password");
  const nav = useNavigate();
  const [loadingState, setLoadingState] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordSchemaType) => {
    try {
      setLoadingState(true);
      await forgotPassword(data.email);
      nav(AppRoutes.OPT_CODE, { state: { email: data.email } });
    } catch (err) {
      toast.error("Something went wrong.");
      console.error("Error sending reset link:", err);
    } finally {
      setLoadingState(false);
    }
  };

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
              placeholder="Enter your email to send reset code ..."
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loadingState}
            className={`w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {loadingState ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
