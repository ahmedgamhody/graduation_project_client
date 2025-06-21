import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MachineQuestionsFormData,
  MachineQuestionsSchema,
} from "../../validation/MachineQuestionsValidation";
import { numberInputs, selectorInputs } from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { sendMachineQuestions, sendUserProgram } from "../../utils/api";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MachineQuestions() {
  const location = useLocation();
  const nav = useNavigate();  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { gender, birthDate } = location.state?.user || {};
  const { id } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const validateData = () => {
      if (!location.state?.user) {
        console.error("User data is missing from location state");
        nav("/", { replace: true });
        return;
      }

      if (!gender || !birthDate) {
        console.error("Required user data is missing:", {
          gender,
          birthDate,
        });
        nav("/", { replace: true });
        return;
      }

      if (!id) {
        console.error("User ID is missing");
        nav("/", { replace: true });
        return;
      }

      setIsValidating(false);
    };
    validateData();
  }, [location.state, gender, birthDate, id, nav]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<MachineQuestionsFormData>({
    resolver: zodResolver(MachineQuestionsSchema),
    mode: "onChange",
  });

  // Combine all questions for step-by-step navigation
  const allQuestions = [...selectorInputs, ...numberInputs].sort(
    (a, b) => a.quotation_number - b.quotation_number
  );

  const totalSteps = allQuestions.length;
  const currentQuestion = allQuestions[currentStep];

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const isCurrentStepValid = () => {
    if (!currentQuestion) return false;
    const currentValue = watch(currentQuestion.name);
    return currentValue !== undefined && currentValue !== null && String(currentValue).trim() !== "";
  };

  if (isValidating) {
    return (
      <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Validating data...</p>
        </div>
      </div>
    );
  }

  let Age = 0;
  if (birthDate) {
    try {
      const today = new Date();
      const birth = new Date(birthDate);

      if (isNaN(birth.getTime())) {
        console.error("Invalid birth date:", birthDate);
        Age = 1;
      } else {
        Age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          Age--;
        }
        Age = Math.max(Age, 1);
      }
    } catch (error) {
      console.error("Error calculating age:", error);
      Age = 1;
    }
  }

  const onSubmit = async (data: MachineQuestionsFormData) => {
    try {
      setLoading(true);

      if (!gender || Age === 0) {
        console.error("Missing required data for submission");
        return;
      }

      if (!id) {
        console.error("User ID is missing");
        return;
      }

      const res = await sendMachineQuestions({ ...data, gender, Age });

      if (!res?.data?.predicted_tourism_type) {
        console.error("Invalid response from machine questions API");
        return;
      }

      await sendUserProgram(id, res.data.predicted_tourism_type);
      nav("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-bold text-primary">
          Recommended Tour Program
        </h1>
        <p className="text-center text-gray-600 mt-2">
          * All prices and values are in US Dollars (USD).
        </p>

        {/* Progress Bar */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Question Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 min-h-[400px] flex flex-col justify-between">
            {currentQuestion && (
              <div className="flex-1">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    <span className="text-secondary">
                      Q{currentQuestion.quotation_number})
                    </span>{" "}
                    {currentQuestion.label}
                  </h2>
                </div>                <div className="flex justify-center">
                  <div className="w-full max-w-md">                    {/* Selector Input */}
                    {selectorInputs.find(input => input.name === currentQuestion.name) && (
                      <select
                        key={`select-${currentQuestion.name}-${currentStep}`}
                        {...register(currentQuestion.name)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-all duration-200"
                      >
                        <option value="">Select Option</option>
                        {selectorInputs.find(input => input.name === currentQuestion.name)?.options.map((option: string) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}{/* Number Input */}
                    {numberInputs.find(input => input.name === currentQuestion.name) && (
                      <input
                        key={`number-${currentQuestion.name}-${currentStep}`}
                        type="number"
                        {...register(currentQuestion.name)}
                        placeholder="Enter your value"
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      />
                    )}

                    {/* Error Message */}
                    {errors[currentQuestion.name] && (
                      <p className="text-red-500 text-sm mt-2 text-center">
                        {errors[currentQuestion.name]?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentStep
                        ? "bg-primary scale-125"
                        : index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>

              {currentStep < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                  className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
