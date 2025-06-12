import { Link } from "react-router-dom";
import { ContactUsProblem } from "../../types";
import { Reply, Trash2 } from "lucide-react";

export default function ProblemCard({
  problem,
  handleDeleteProblem,
  isDeleting = false,
  handleShowResolvedModal,
}: {
  problem: ContactUsProblem;
  handleDeleteProblem?: (problemId: number) => void;
  isDeleting?: boolean;
  handleShowResolvedModal?: (problemId: number) => void;
}) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        problem.isResolved ? "bg-green-50" : "bg-red-50"
      }`}
    >
      <div className="flex items-start space-x-4">
        <Link to={`/show-user-profile/${problem.userId}`}>
          <img
            src={`https://egypt-guid26.runasp.net/images/${problem.userPhoto}`}
            alt={problem.userName}
            className={`w-12 h-12 rounded-full object-cover border-2 ${
              problem.isResolved ? "border-green-200" : "border-gray-200"
            } `}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Link to={`/show-user-profile/${problem.userId}`}>
              <h4 className="text-sm font-semibold text-gray-900 truncate hover:underline">
                {problem.userName}
              </h4>
            </Link>
            <div className="flex items-center space-x-2">
              {problem.isResolved ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Resolved
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Not Resolved
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(problem.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2">{problem.userEmail}</p>{" "}
          <p className="text-sm text-gray-800 leading-relaxed">
            {problem.problem}
          </p>
        </div>
      </div>

      {/* Action buttons - only show if problem is not resolved */}
      {!problem.isResolved ? (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
          {" "}
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleDeleteProblem?.(problem.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </button>
          {/* Resolve Button */}
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            onClick={() => handleShowResolvedModal?.(problem.id)}
          >
            <Reply className="w-4 h-4 mr-2" />
            Resolve
          </button>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleDeleteProblem?.(problem.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
