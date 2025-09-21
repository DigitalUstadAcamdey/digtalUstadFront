"use client";
import {
  Download,
  FilePresent,
  Comment,
  ReplyRounded,
} from "@mui/icons-material";
import { Edit, Loader2, Trash2 } from "lucide-react";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import CourseCardDetails from "./CourseCardDetails";
import { Course } from "@/types/course";
import { useUserStore } from "@/store/userStore";
import Spinner from "../spinner/Spinner";
import { useLesson } from "@/store/lessonStore";
import "react-toastify/dist/ReactToastify.css";
import { Reply } from "./comments and replies/Reply";
import AddComment from "./comments and replies/AddComment";
import EditCommentModal from "./comments and replies/EditComment";
import DeleteCommentModal from "./comments and replies/DeleteComment";

import AddReply from "./comments and replies/AddReply";
import DynamicVideoPlyr from "../utlisComponenets/DynamicVideoPlyr";
import { CheckCircle2, Circle } from "lucide-react";
import axios, { AxiosError } from "axios";
import showToast from "@/utils/showToast";
import { useSearchParams } from "next/navigation";
import ScrollToTopButton from "../utlisComponenets/ScrollToTopButton";

type Props = {
  course: Course;
};

const CoursePage = ({ course }: Props) => {
  const { lesson, setLesson } = useLesson();
  // get section and lesson index
  const searchParams = useSearchParams();
  const sectionIndex = searchParams.get("section");
  const videoIndex = searchParams.get("video");

  const [showAllFiles, setShowAllFiles] = useState(false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // State for delete loading
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isShowDeletingModal, setIsShowDeletingModal] =
    useState<boolean>(false); // State for delete loading
  const [isShowEditingModal, setIsShowEditingModal] = useState<boolean>(false);
  const [commentObj, setCommentObj] = useState<{
    commentTitle: string | null;
    commentId: string | null;
  }>({
    commentTitle: null,
    commentId: null,
  });

  const checkIsEnrolledCourse = (
    userId: string,
    course: Course | undefined
  ) => {
    return course?.enrolledStudents.some((s) => s === userId);
  };

  const { user } = useUserStore();

  //set first lesson from first section or set section index and lesson index from query ex : /course/courseId/section=0&video=1
  useEffect(() => {
    if (!course?.sections?.length) return;

    let selectedLesson = null;

    const sectionIdx = Number(sectionIndex);
    const videoIdx = Number(videoIndex);

    // إذا كاين indices صحيحة
    if (!Number.isNaN(sectionIdx) && !Number.isNaN(videoIdx)) {
      const section = course.sections[sectionIdx];
      if (section?.videos?.[videoIdx]) {
        selectedLesson = section.videos[videoIdx];
      }
    }

    // إذا ماكانش indices أو ماكانوش valid → رجع أول فيديو من أول سكشن
    if (!selectedLesson) {
      const firstSection = course.sections[0];
      if (firstSection?.videos?.[0]) {
        selectedLesson = firstSection.videos[0];
      }
    }

    // fallback object إذا ماكان حتى فيديو
    setLesson(
      selectedLesson || {
        _id: "",
        lessonTitle: "",
        url: "",
        duration: "0",
        isCompleted: false,
        completedBy: [],
        comments: [],
        description: "",
        files: [],
      }
    );
  }, [course, sectionIndex, videoIndex, setLesson]);

  const isEnrolledMemo = useMemo(() => {
    if (!user._id || !course) return false;
    return checkIsEnrolledCourse(user._id, course);
  }, [user._id, course]);

  const isPublichedCourseMemo = useMemo(() => {
    if (!user._id || !course) return false;
    return (
      course?.instructor._id === user._id &&
      user.publishedCourses.some((c) => c._id === course?._id)
    );
  }, [user._id, course, user.publishedCourses]);
  // replace check to middleware.ts
  const userIsCompeletedLesson = useMemo(() => {
    return lesson.completedBy.includes(user._id);
  }, [lesson.completedBy, user._id]);
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return (
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-xs font-bold">
            PDF
          </div>
        );
      case "doc":
      case "docx":
        return (
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">
            DOC
          </div>
        );
      case "ppt":
      case "pptx":
        return (
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xs font-bold">
            PPT
          </div>
        );
      case "zip":
      case "rar":
        return (
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xs font-bold">
            ZIP
          </div>
        );
      default:
        return <FilePresent className="w-12 h-12 text-gray-400" />;
    }
  };

  //add spinner
  if (isEnrolledMemo === null || isPublichedCourseMemo === null) {
    return <Spinner />;
  }

  // Comments Functions
  const showEditingModal = (commentTitle: string, commentId: string) => {
    setIsShowEditingModal(true);
    setCommentObj({
      commentTitle,
      commentId,
    });
  };
  const showDeleteingModal = (commentTitle: string, commentId: string) => {
    setIsShowDeletingModal(true);
    setCommentObj({
      commentTitle,
      commentId,
    });
  };
  const closeEditingModal = () => {
    setIsShowEditingModal(false);
  };
  const closeDeleteingModal = () => {
    setIsShowDeletingModal(false);
  };

  const handleDeleteComment = async (commentId: string | null) => {
    setIsDeleting(commentId);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comments/${commentId}/lessons/${lesson._id}`,
        {
          withCredentials: true,
        }
      );
      showToast("success", "تم حذف تعليقك بنجاح");
      setLesson({
        ...lesson,
        comments: lesson.comments.filter((comment) => {
          return comment._id !== commentId;
        }),
      });
      closeDeleteingModal();
    } catch (error) {
      console.error(error);
      showToast("error", "حدث خطأ أثناء الحذف، حاول مجددًا");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditComment = async (
    commentId: string | null,
    newText: string
  ) => {
    setIsEditing(commentId);

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/comments/${commentId}/lessons/${lesson._id}`,
        {
          text: newText,
        },
        {
          withCredentials: true,
        }
      );
      const updatedComments = lesson.comments.map((comment) =>
        comment._id === commentId ? res.data.comment : comment
      );

      setLesson({
        ...lesson,
        comments: updatedComments,
      });
      showToast("success", "تم تعديل تعليقك بنجاح");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>; // 👈 نعمل cast
      const message =
        err.response?.data?.message || err.message || "خطأ غير متوقع";
      showToast("error", message);
    } finally {
      setIsEditing(null);
    }
  };
  return (
    <div className="h-[93vh] xs:px-4 xl:px-0  relative overflow-y-scroll  ">
      <div className="flex flex-row-reverse gap-4 mx-auto">
        {/* Course Details Sidebar */}
        <CourseCardDetails
          courseId={course?._id}
          userId={user._id}
          sections={course?.sections}
        />

        {/* Main Content */}
        <div className="flex-1 lg:max-w-4xl mx-auto space-y-8">
          {/* Video Player Section And Some Info of Lesson and Course */}
          <div className="bg-white/80 dark:bg-bodyDark dark:bg-opacity-100 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 border border-white/50 dark:border-gray-700">
            <div className="relative">
              <DynamicVideoPlyr videoId={lesson?.url} />
            </div>

            {/* Lesson Info Card - Inspired by the provided image */}
            <div className=" p-6 rounded-2xl flex flex-row-reverse items-start gap-6">
              {/* Status Indicator: "مكتمل" or "غير مكتمل" */}
              <div
                className={`
      ${userIsCompeletedLesson ? "bg-[#3f51b5]" : "bg-gray-700"}
      flex items-center justify-center gap-2
      px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap
    `}
              >
                {userIsCompeletedLesson ? (
                  <>
                    <span className="text-white">مكتمل</span>
                    <CheckCircle2 size={18} className="text-white" />
                  </>
                ) : (
                  <>
                    <span className="text-gray-400">غير مكتمل</span>
                    <Circle size={18} className="text-gray-400" />
                  </>
                )}
              </div>

              {/* Content Section: Title and Description */}
              <div className="flex-1">
                {/* Main Title from the Image */}
                <h3 className="apply-fonts-medium text-lg text-gray-400 leading-tight mb-1">
                  {course?.title}
                </h3>
                {/* Secondary Title from the Image */}
                <h2 className="apply-fonts-medium text-xl lg:text-2xl text-white leading-tight mb-4">
                  {lesson?.lessonTitle}
                </h2>

                {/* Description from the Image */}
                <p className="apply-fonts-normal text-gray-300 leading-relaxed text-base">
                  {lesson?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Lesson Files */}
          <div className="bg-white/80 dark:bg-bodyDark dark:bg-opacity-100 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 border border-white/50 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FilePresent className="text-white text-lg" />
                </div>
                <h2 className="apply-fonts-medium dark:text-white text-xl lg:text-2xl text-gray-800">
                  ملفات الدرس
                </h2>
              </div>
              {lesson?.files && lesson.files.length > 3 && (
                <button
                  onClick={() => setShowAllFiles(!showAllFiles)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showAllFiles
                    ? "إظهار أقل"
                    : `عرض الكل (${lesson.files.length})`}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {lesson?.files && lesson.files.length > 0 ? (
                <>
                  {(showAllFiles ? lesson.files : lesson.files.slice(0, 3)).map(
                    (file, index) => (
                      <div
                        key={file._id}
                        className="group bg-gradient-to-r from-gray-50 to-blue-50/30 hover:from-blue-50 hover:to-purple-50/50 rounded-xl p-4 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg dark:from-[#1a1c3d] dark:to-[#1a1c3d] dark:border-gray-700 dark:hover:from-[#21235a] dark:hover:to-[#21235a]"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {getFileIcon(file.filename)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-800 transition-colors dark:text-gray-200 dark:group-hover:text-blue-400">
                                {file.filename}
                              </h3>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatFileSize(Number(file.size))}
                                </span>
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                  ملف {index + 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={file.url}
                            target="_blank"
                            download={true}
                            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
                          >
                            <Download className="text-sm" />
                            <span className="apply-fonts-normal xs:hidden sm:inline">
                              تحميل
                            </span>
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center dark:bg-gray-800">
                    <FilePresent className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="apply-fonts-normal text-gray-600 font-medium dark:text-gray-400">
                    لا توجد ملفات متاحة
                  </h3>
                  <p className="apply-fonts-normal text-gray-400 text-sm mt-1 dark:text-gray-500">
                    لم يتم رفع أي ملفات لهذا الدرس بعد
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white/80 dark:bg-bodyDark dark:bg-opacity-100 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-none p-6 border border-white/50 dark:border-gray-800 relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Comment className="text-white text-lg" />
              </div>
              <h2 className="apply-fonts-medium text-xl lg:text-2xl text-gray-800 dark:text-white">
                التعليقات
              </h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300">
                {lesson?.comments.length}
              </div>
            </div>

            <div className="space-y-6 ">
              {lesson?.comments && lesson.comments.length > 0 ? (
                <>
                  {lesson.comments.map((comment, index) => (
                    <div
                      key={comment._id}
                      id={comment._id}
                      className="group bg-gradient-to-r from-white to-gray-50/50 rounded-2xl border border-gray-200/50 hover:border-purple-300/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden dark:from-[#1a1c3d] dark:to-[#1a1c3d] dark:border-gray-700 dark:hover:border-purple-500/50"
                    >
                      {/* Comment Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 p-4 border-b border-gray-200/50 dark:from-[#21235a] dark:to-[#21235a] dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-0.5">
                              <Image
                                src={
                                  comment.user.thumbnail || "/imgs/logoImg.png"
                                }
                                alt="user-avatar"
                                width={48}
                                height={48}
                                className="w-full h-full rounded-full object-cover bg-white"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm dark:border-[#1a1c3d]"></div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-gray-800 dark:text-gray-200">
                                {comment.user.username}
                              </h3>
                              <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-300">
                                طالب
                              </span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-300">
                                تعليق #{index + 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "en-SA"
                                )}
                              </span>
                            </div>
                          </div>
                          {/* Edit and Delete Buttons - NEW SECTION */}
                          {user._id === comment.user._id && (
                            <div className="flex items-center gap-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  showEditingModal(comment.text, comment._id);
                                }}
                                className="text-gray-500 hover:text-blue-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                disabled={isEditing === comment._id}
                              >
                                {isEditing === comment._id ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Edit size={16} />
                                )}
                              </button>
                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  showDeleteingModal(comment.text, comment._id);
                                }}
                                className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                disabled={isDeleting === comment._id}
                              >
                                {isDeleting === comment._id ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="p-4">
                        <div className="rounded-xl p-4  ">
                          <p
                            className="apply-fonts-normal text-gray-700 leading-relaxed dark:text-gray-300"
                            dir="rtl"
                          >
                            {comment.text}
                          </p>
                        </div>
                      </div>

                      {/* Reply Section */}
                      <div className="px-4 pb-4  ">
                        {user.role !== "student" && (
                          <div className="mb-3">
                            <button
                              onClick={() =>
                                setReplyingToCommentId(comment._id)
                              }
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#B9BCFF]/20 to-[#B9BCFF]/10 hover:from-[#B9BCFF]/30 hover:to-[#B9BCFF]/20 text-[#3D45EE] rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                            >
                              <ReplyRounded className="text-lg" />
                              <span className="apply-fonts-normal">
                                رد على التعليق
                              </span>
                            </button>
                          </div>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                          <div className="bg-gray-50/50 rounded-xl p-3 mt-3 dark:bg-[#1a1c3d]">
                            <Reply replys={comment.replies} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center dark:from-purple-900/30 dark:to-pink-900/30">
                    <Comment className="text-purple-400 text-3xl dark:text-purple-500" />
                  </div>
                  <h3 className="apply-fonts-normal text-gray-600 text-xl font-medium mb-2 dark:text-gray-400">
                    لا توجد تعليقات بعد
                  </h3>
                  <p className="apply-fonts-normal text-gray-400 dark:text-gray-500">
                    كن أول من يشارك رأيه حول هذا الدرس الرائع
                  </p>
                </div>
              )}
            </div>

            {/* Add Comment Section */}
            {user.role === "student" && (
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700">
                <AddComment courseId={course._id} />
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
      {replyingToCommentId && (
        <AddReply
          commentId={replyingToCommentId}
          onClose={() => setReplyingToCommentId(null)}
        />
      )}
      {isShowEditingModal && (
        <EditCommentModal
          commentTitle={commentObj.commentTitle}
          onClose={closeEditingModal}
          onConfirm={async (newComment: string) => {
            try {
              await handleEditComment(commentObj.commentId, newComment);
              closeEditingModal(); // إخفاء المودل عند النجاح
            } catch (error) {
              console.error("خطأ في تعديل التعليق:", error);
              // المودل سيبقى مفتوحاً في حالة الخطأ
            }
          }}
          isLoading={commentObj.commentId === isEditing}
        />
      )}
      {isShowDeletingModal && (
        <DeleteCommentModal
          commentTitle={commentObj.commentTitle}
          onClose={closeDeleteingModal}
          onConfirm={async () => {
            await handleDeleteComment(commentObj.commentId);
          }}
          isLoading={commentObj.commentId === isDeleting}
        />
      )}
    </div>
  );
};

export default CoursePage;
