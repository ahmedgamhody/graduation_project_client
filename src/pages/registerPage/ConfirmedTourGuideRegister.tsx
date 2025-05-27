import { Link } from "react-router-dom";
import useTitle from "../../hooks/useChangePageTitle";
import { CheckCircleIcon, ClockIcon, MailIcon } from "lucide-react";

export default function ConfirmedTourGuideRegister() {
  useTitle("Registration Submitted Successfully");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <img
          src="/main_logo.png"
          alt="Main Logo"
          className="mx-auto block w-24 md:w-32 lg:w-42 mb-6"
        />

        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Registration Submitted Successfully!
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed">
            Thank you for applying to become a{" "}
            <span className="font-semibold text-primary">Tour Guide</span> with
            us!
          </p>

          {/* Status Steps */}
          <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  Your application has been received
                </p>
                <p className="text-sm text-gray-600">
                  All your documents and information have been successfully
                  submitted
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ClockIcon className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-gray-800">
                  Under review by our admin team
                </p>
                <p className="text-sm text-gray-600">
                  Our team will carefully review your credentials and
                  qualifications
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MailIcon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-gray-800">Email notification</p>
                <p className="text-sm text-gray-600">
                  You'll receive an email with the approval decision within 2-3
                  business days
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>What's next?</strong>
                  <br />
                  Please check your email regularly. If approved, you'll receive
                  login credentials and further instructions to start your
                  journey as a tour guide with us.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to="/"
              className="flex-1 bg-primary text-white py-3 px-6 rounded-md hover:bg-secondary transition duration-300 text-center font-medium"
            >
              Back to Home
            </Link>
            <Link
              to="/login"
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition duration-300 text-center font-medium"
            >
              Login Page
            </Link>
          </div>

          {/* Contact Info */}
          <p className="text-xs text-gray-500 mt-6">
            Have questions? Contact us at{" "}
            <a
              href="mailto:support@company.com"
              className="text-blue-600 hover:underline"
            >
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
