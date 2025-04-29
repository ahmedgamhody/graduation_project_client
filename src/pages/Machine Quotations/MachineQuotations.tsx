import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  MachineQuotationsFormData,
  MachineQuotationsSchema,
} from "../../validation/MachineQuotationsValidation";
import { numberInputs, selectorInputs } from ".";

export default function MachineQuotations() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<MachineQuotationsFormData>({
    resolver: zodResolver(MachineQuotationsSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: MachineQuotationsFormData) => {
    console.log("Register Data:", data);
    // try {
    //   const result = await dispatch(actAuthRegister(data)).unwrap();

    //   if (result.token) {
    //     toast.success(`Registration successful! Welcome ${result.name}`);
    //     nav("/machine-quotations");
    //   } else {
    //     toast.error("Registration failed. Please check your details.");
    //   }
    // } catch (error) {
    //   toast.error("Registration failed. Please try again!");
    //   console.error("Error registering user:", error);
    // }
  };
  return (
    <div className="container mx-auto my-5">
      <h1 className="text-center text-4xl font-bold text-primary">
        Machine Quotations
      </h1>
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
                </span>{" "}
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
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isValid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
