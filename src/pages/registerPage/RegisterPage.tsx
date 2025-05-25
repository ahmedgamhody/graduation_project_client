import { Link } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { AppRoutes } from "../../constants/enums";
export default function RegisterPage() {
  useTitle("Register");
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <img
          src="/main_logo.png"
          alt="Register Logo"
          className="mx-auto block w-24 md:w-32 lg:w-28 mb-4"
        />

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create an Account
          </h2>
          <div className="flex flex-col gap-4 ">
            <Link
              to={AppRoutes.REGISTER_USER}
              className=" px-4 py-2 text-sm font-medium text-white bg-secondary rounded-full hover:bg-[#3c3cd1] transition duration-300 w-full text-center"
            >
              Register as Visitor
            </Link>
            <Link
              to={AppRoutes.REGISTER_TOUR_GUIDE}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-white transition bg-gray-200 rounded-full w-full text-center hover:bg-primary  duration-300"
            >
              Register as Tour Guide
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link
            to={AppRoutes.LOGIN}
            className="text-purple-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
