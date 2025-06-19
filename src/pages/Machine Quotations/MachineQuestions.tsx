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

export default function MachineQuestions() {
  const location = useLocation();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
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
    formState: { errors, isValid },
  } = useForm<MachineQuestionsFormData>({
    resolver: zodResolver(MachineQuestionsSchema),
    mode: "onChange",
  });

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
  };
  return (
    <div className="container mx-auto my-5 px-4 md:px-8 lg:px-16">
      <h1 className="text-center text-4xl font-bold text-primary">
        Recommended Tour Program
      </h1>
      <p className="text-center text-gray-600 mt-2">
        * All prices and values are in US Dollars (USD).
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap mt-12 justify-between gap-5">
          {selectorInputs.map((input) => (
            <div
              className="mb-3 flex flex-col gap-2 w-full md:w-[48%] "
              key={input.name}
            >
              <label className="text-2xl font-bold">
                <span className="text-secondary">
                  {" "}
                  Q{input.quotation_number})
                </span>
                {input.label}
              </label>
              <select
                {...register(input.name)}
                className="w-1/2 md:w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300 cursor-pointer"
              >
                <option className="hidden">Select Option</option>
                {input.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors[input.name] && (
                <p className="text-red-500 text-sm">
                  {errors[input.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          {numberInputs?.map((input) => (
            <div
              key={input.name}
              className="mb-3 flex flex-col gap-2 w-full md:w-[48%] "
            >
              <label className="text-2xl font-bold">
                <span className="text-secondary">{` Q${input.quotation_number}) `}</span>{" "}
                {input.label}
              </label>
              <input
                type="number"
                {...register(input.name)}
                placeholder={"Enter your value"}
                className="w-1/2 px-3 md:w-full py-2 border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              />
              {errors[input.name] && (
                <p className="text-red-500 text-sm">
                  {errors[input.name]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 w-full">
          <button
            className="w-1/3 px-4 py-2 rounded-md transition duration-300
          bg-primary text-white hover:bg-secondary
          disabled:bg-gray-400 disabled:cursor-not-allowed
          flex items-center justify-center"
            type="submit"
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></span>
                Loading ...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
