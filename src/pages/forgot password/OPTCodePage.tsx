import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OTPSchema,
  OTPSchemaType,
} from "../../validation/ForgotPasswordValidation";
import { toast } from "react-hot-toast";
import { forgotPassword, sendOTPCode } from "../../utils/api";
import { ArrowLeftIcon } from "lucide-react";
import { AppRoutes } from "../../constants/enums";

export default function OPTCodePage() {
  const location = useLocation();
  const nav = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email;
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    trigger,
  } = useForm<OTPSchemaType>({
    resolver: zodResolver(OTPSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = watch("otp");

  useEffect(() => {
    if (!email) {
      nav("/forgot-password");
    }
  }, [email, nav]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOTP = otpValue.split("");
    newOTP[index] = value;
    const updatedOTP = newOTP.join("");

    setValue("otp", updatedOTP);
    trigger("otp");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setValue("otp", pastedData);
    trigger("otp");

    // Focus the last filled input or the first empty one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };
  const onSubmit = async (data: OTPSchemaType) => {
    try {
      await sendOTPCode(data.otp);
      // Navigate to reset password page
      nav("/reset-password", { state: { email, otp: data.otp } });
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
  };
  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      // Here you would make an API call to resend OTP
      await forgotPassword(email);
      toast.success("OTP has been resent to your email!");
      setCountdown(120);
      setCanResend(false);
    } catch {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <img
          src="/main_logo.png"
          alt="Main Logo"
          className="mx-auto block w-24 md:w-32 lg:w-42 mb-6"
        />

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-blue-600 font-medium text-sm break-all">{email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.otp
                      ? "border-red-500 bg-red-50"
                      : otpValue[index]
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  value={otpValue[index] || ""}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoComplete="off"
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              isValid && !isSubmitting
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend in {countdown} seconds
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => nav(AppRoutes.FORGOT_PASSWORD)}
            className="text-white hover:text-gray-800 text-sm transition-colors flex gap-2 items-center justify-center bg-blue-500 hover:bg-black/20 px-4 py-2 rounded-md"
          >
            <ArrowLeftIcon />
            <p>Back to Email Verification</p>
          </button>
        </div>
      </div>
    </div>
  );
}
