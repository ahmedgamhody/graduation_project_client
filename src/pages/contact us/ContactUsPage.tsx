import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import messageDone from "../../animations/messagedone.json";
import contactUs from "../../animations/contact-us.json";
import {
  ContactUsFormData,
  ContactUsSchema,
} from "../../validation/ContactUsValidation";
import { sendContactUserMessage } from "../../utils/api";
import { useAppSelector } from "../../store/hooks";
import useTitle from "../../hooks/useChangePageTitle";
export default function ContactUsPage() {
  useTitle("Contact Us ");
  const { token } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactUsFormData>({
    resolver: zodResolver(ContactUsSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactUsFormData) => {
    setIsSubmitting(true);
    try {
      await sendContactUserMessage(data.problem, token);
      setShowSuccess(true);
      reset();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 8000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen  to-indigo-100 py-5 px-4 md:px-8 lg:px-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary">
          Contact Us
        </h1>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mt-10">
          <div className="w-full bg-white rounded-2xl shadow-xl p-8">
            {showSuccess ? (
              <div className="text-center py-8">
                <Lottie
                  animationData={messageDone}
                  style={{ width: "200px", height: "200px" }}
                  className="mx-auto"
                  loop={false}
                />
                <h3 className="text-xl font-semibold text-green-600 mt-4">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mt-2">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    {...register("problem")}
                    disabled={isSubmitting}
                    rows={8}
                    placeholder="Write your message or problem here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  />
                  {errors.problem && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.problem.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Animation Section */}
          <div className="flex justify-content-center align-items-center text-center">
            <Lottie
              animationData={contactUs}
              style={{ width: "450px", height: "450px" }}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
