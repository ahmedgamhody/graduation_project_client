import { Button } from "flowbite-react";
import { useState } from "react";
import {
  addComment,
  deleteComment,
  updateComment,
  deleteCommentByAdmin,
} from "../../utils/api";
import { queryClient } from "../../main";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { TComment, TPlaceDetails } from "../../types";
import avatar from "../../../public/avatar.png";
import { Menu } from "@headlessui/react";
import DeleteSpinier from "../../animations/DeleteSpinier";
import { UserRoles } from "../../constants/enums";
import { Trash2 } from "lucide-react";
export default function SinglePlaceComments({ data }: { data: TPlaceDetails }) {
  const { name } = useParams();
  const nav = useNavigate();
  const { token, id, role } = useAppSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isNeedToUpdateStatus, setIsNeedToUpdateStatus] = useState(false);
  const [commentNeedToUpdate, setCommentNeedToUpdate] = useState<TComment>({});
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const handleComment = async () => {
    if (!comment.trim() || !name) return;
    if (!token) return nav("/login");

    try {
      setIsSubmittingComment(true);
      await addComment(token, comment.trim(), name);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["place"] });
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  const handleDeleteComment = async (commentId: number) => {
    if (!name || !commentId) return;

    try {
      setDeletingCommentId(commentId);
      await deleteComment(token, commentId);
    } catch (error) {
      console.error("Failed to deleted  comment:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["place"] });
      setDeletingCommentId(null);
    }
  };

  const handleDeleteCommentByAdmin = async (commentId: number) => {
    if (!commentId) return;

    try {
      setDeletingCommentId(commentId);
      await deleteCommentByAdmin(token, commentId);
    } catch (error) {
      console.error("Failed to delete comment by admin:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["place"] });
      setDeletingCommentId(null);
    }
  };
  const handleUpdateComment = async (commentId: number) => {
    if (!name || !commentId) return;
    try {
      setIsUpdateLoading(true);
      await updateComment(token, {
        commentId,
        content: commentNeedToUpdate.content || "",
      });
    } catch (error) {
      console.error("Failed to update  comment:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["place"] });
      setIsNeedToUpdateStatus(false);
      setCommentNeedToUpdate({});
      setIsUpdateLoading(false);
    }
  };
  return (
    <>
      {role !== UserRoles.ADMIN && role !== UserRoles.TOUR_GUIDE && (
        <>
          <div className="mt-3">
            <label
              htmlFor="comment"
              className="block mb-2 text-lg font-medium text-gray-700"
            >
              Review Lists
            </label>{" "}
            <textarea
              id="comment"
              name="comment"
              rows={2}
              disabled={isSubmittingComment}
              value={comment}
              placeholder="Write Your Comment ..."
              className="w-full max-w-[600px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>{" "}
          <div className="flex justify-start">
            <Button
              disabled={!comment.trim() || isSubmittingComment}
              className="bg-secondary enabled:hover:bg-primary !important"
              onClick={handleComment}
            >
              {isSubmittingComment ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </>
      )}

      {/* Comments Section */}
      <div className="mt-8">
        {" "}
        <h2 className="text-xl font-bold text-primary mb-4">
          Reviews & Comments ({data?.comments ? data?.comments.length : 0})
        </h2>
        {data?.comments && data?.comments?.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {" "}
            {data.comments.map((commentItem, index) =>
              isNeedToUpdateStatus &&
              commentNeedToUpdate?.id === commentItem.id ? (
                <div key={commentItem.id || index}>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={2}
                    disabled={isUpdateLoading}
                    value={commentNeedToUpdate?.content || ""}
                    placeholder="Write Your Comment ..."
                    className="w-full  p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    onChange={(e) => {
                      setCommentNeedToUpdate({
                        ...commentNeedToUpdate,
                        content: e.target.value,
                      });
                    }}
                  ></textarea>
                  <div className="flex justify-end mt-2 gap-2">
                    <Button
                      className="bg-secondary enabled:hover:bg-primary !important"
                      disabled={isUpdateLoading}
                      onClick={() => {
                        if (commentNeedToUpdate?.id) {
                          handleUpdateComment(commentNeedToUpdate?.id);
                        }
                      }}
                    >
                      {isUpdateLoading ? "Updating..." : "Update"}
                    </Button>
                    <Button
                      className="bg-red-500 enabled:hover:bg-red-600 !important"
                      disabled={isUpdateLoading}
                      onClick={() => {
                        setIsNeedToUpdateStatus(false);
                        setCommentNeedToUpdate({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={commentItem.id || index}
                  className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative ${
                    deletingCommentId === commentItem.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Delete Loading Overlay */}
                  {deletingCommentId === commentItem.id && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg z-10">
                      <div className="flex flex-col items-center gap-2">
                        <DeleteSpinier />
                        <span className="text-red-600 font-medium">
                          Deleting comment...
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    {" "}
                    <Link to={`/show-user-profile/${commentItem.userId}`}>
                      <div className="flex items-center gap-3 hover:underline hover:text-blue-600 transition duration-300">
                        <img
                          src={avatar}
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="font-semibold text-gray-800">
                          {commentItem.userName || "Anonymous User"}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center ">
                      {commentItem?.userId === id && (
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <Menu.Button
                            className="inline-flex w-full justify-center items-center gap-x-1 rounded-md bg-white px-3 pb-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            disabled={deletingCommentId === commentItem.id}
                          >
                            ....
                          </Menu.Button>
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`block w-full px-4 py-2 text-left text-sm ${
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-blue-700"
                                    }`}
                                    disabled={
                                      deletingCommentId === commentItem.id
                                    }
                                    onClick={() => {
                                      if (commentItem.id) {
                                        setCommentNeedToUpdate(commentItem);
                                        setIsNeedToUpdateStatus(true);
                                      }
                                    }}
                                  >
                                    Update
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      if (commentItem?.id) {
                                        handleDeleteComment(commentItem.id);
                                      }
                                    }}
                                    className={`block w-full px-4 py-2 text-left text-sm ${
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-red-700"
                                    }`}
                                    disabled={
                                      deletingCommentId === commentItem.id
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      )}{" "}
                    </div>
                    {role == UserRoles.ADMIN && (
                      <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                        onClick={() => {
                          if (commentItem?.id) {
                            handleDeleteCommentByAdmin(commentItem.id);
                          }
                        }}
                      />
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {commentItem?.content}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No comments yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to leave a comment about this place!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
