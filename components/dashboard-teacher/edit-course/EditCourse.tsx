// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ChangeEvent, useState } from "react";
import {
  BookOpen,
  DollarSign,
  Tag,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Video,
  File,
  Link,
  Save,
  Upload,
  Settings,
  PlayCircle,
  FolderOpen,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Course, Section } from "@/types/course";
import Image from "next/image";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import showToast from "@/utils/showToast";
import { useRouter } from "next/navigation";

interface CourseDetails {
  imageCover: File | null;
  title: string;
  price: number;
  description: string;
  category: string;
  concepts: string[];
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  type = "danger",
  loading = false,
}) => {
  if (!isOpen) return null;

  const getTypeColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          bg: "bg-red-50",
          button: "bg-red-500 hover:bg-red-600",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          bg: "bg-yellow-50",
          button: "bg-yellow-500 hover:bg-yellow-600",
        };
      default:
        return {
          icon: "text-blue-500",
          bg: "bg-blue-50",
          button: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const colors = getTypeColors();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-modal">
        {/* Modal Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`p-3 ${colors.bg} rounded-full`}>
            <AlertTriangle className={`${colors.icon}`} size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-b-2xl">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:cursor-not-allowed`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 ${colors.button}`}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={18} />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseEditPage = ({ courseFetcher }: { courseFetcher: Course }) => {
  const router = useRouter();

  const [course, setCourse] = useState<Course>(courseFetcher);
  const [sections, setSections] = useState<Section[]>(courseFetcher.sections);
  const [concepts, setConcepts] = useState<string[]>(courseFetcher.concepts);
  const [editeCourseLoading, setEditeCourseLoading] = useState<boolean>(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
    loading?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
    loading: false,
  });

  // Section
  const [addSectionLoading, setAddSectionLoading] = useState<boolean>(false);
  const [editSectionLoading, setEditSectionLoading] = useState<boolean>(false);
  const [deleteSectionLoading, setDeleteSectionLoading] =
    useState<boolean>(false);
  const [showSectionModal, setShowSectionModal] = useState<boolean>(false);
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>("");

  // Videos
  const [addVideoLoading, setAddVideoLoading] = useState<boolean>(false);
  const [editVideoLoading, setEditVideoLoading] = useState<boolean>(false);
  const [deleteVideoLoading, setDeleteVideoLoading] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [newVideoTitle, setNewVideoTitle] = useState<string>("");
  const [newVideoDescription, setNewVideoDescription] = useState<string>("");
  const [newVideoDuration, setNewVideoDuration] = useState<string>("");
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<string>("");
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editingVideoTitle, setEditingVideoTitle] = useState<string>("");

  // Files
  const [showFileModal, setShowFileModal] = useState<boolean>(false);
  const [addFileLoading, setAddFileLoading] = useState<boolean>(false);
  const [DeleteFileLoading, setDeleteFileLoading] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>("");

  // UI State
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());

  // for showing the image cover of course
  const [imageCoverPreview, setImageCoverPreview] = useState<string | null>(
    courseFetcher.imageCover
  );

  const handleImageCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCourseData((prev) => ({ ...prev, imageCover: file }));
      setImageCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const [activeTab, setActiveTab] = useState("details");
  const [courseData, setCourseData] = useState<CourseDetails>({
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    imageCover: null,
    concepts: course.concepts,
  });

  const [newConcept, setNewConcept] = useState("");

  const tabs = [
    { id: "details", label: "تفاصيل الكورس", icon: BookOpen },
    { id: "sections", label: "الأقسام والفيديوهات", icon: Video },
  ];

  const categories = [
    { value: "رياضيات", label: "رياضيات" },
    { value: "فيزياء", label: "فيزياء" },
    { value: "علوم", label: "علوم" },
    { value: "أدب", label: "أدب" },
    { value: "شريعة", label: "شريعة" },
    { value: "إجتماعيات", label: "إجتماعيات" },
    { value: "فلسفة", label: "فلسفة" },
    { value: "إقتصاد", label: "إقتصاد" },
    { value: "محاسبة", label: "محاسبة" },
    { value: "أخرى", label: "أخرى" },
  ];

  const addConcept = () => {
    if (newConcept.trim()) {
      setConcepts([...concepts, newConcept.trim()]);
      setNewConcept("");
    }
  };

  const removeConcept = (index: number) => {
    setConcepts(concepts.filter((_, i) => i !== index));
  };

  // Helper function to show confirm modal
  const showConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "danger" | "warning" | "info" = "danger",
    loading?: boolean
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
      loading,
    });
  };

  const hideConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "danger",
    });
  };

  // Section Functions
  const openSectionModal = () => {
    setShowSectionModal(true);
    setNewSectionTitle("");
  };

  const closeSectionModal = () => {
    setShowSectionModal(false);
    setNewSectionTitle("");
  };

  const addSection = async () => {
    if (!newSectionTitle.trim()) {
      showToast("error", "يرجى إدخال عنوان للقسم");
      return;
    }

    setAddSectionLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}`,
        {
          sectionTitle: newSectionTitle,
        },
        {
          withCredentials: true,
        }
      );

      setSections(
        response.data.sections || [...sections, response.data.section]
      );
      setNewSectionTitle("");
      closeSectionModal();
      showToast("success", "تم إضافة القسم بنجاح");
    } catch (error) {
      console.error("خطأ في إضافة القسم:", error);
      showToast("error", "حدث خطأ في إضافة القسم");
    } finally {
      setAddSectionLoading(false);
    }
  };

  const updateSection = async (sectionId: string, newTitle: string) => {
    setEditSectionLoading(true);
    if (!newTitle.trim()) {
      showToast("error", "عنوان القسم مطلوب");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${sectionId}`,
        {
          title: newTitle,
        },
        {
          withCredentials: true,
        }
      );

      setSections(
        sections.map((section) =>
          section._id === sectionId ? { ...section, title: newTitle } : section
        )
      );
      setEditingSectionId(null);
      showToast("success", "تم تحديث القسم بنجاح");
    } catch (error) {
      console.error("خطأ في تحديث القسم:", error);
      showToast("error", "حدث خطأ في تحديث القسم");
    } finally {
      setEditSectionLoading(false);
    }
  };

  const deleteSection = async (sectionId: string) => {
    const performDelete = async () => {
      setDeleteSectionLoading(true);
      setConfirmModal((prev) => {
        return { ...prev, loading: true };
      });
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${sectionId}`,
          {
            withCredentials: true,
          }
        );

        setSections(sections.filter((section) => section._id !== sectionId));
        showToast("success", "تم حذف القسم بنجاح");
        hideConfirmModal();
      } catch (error) {
        console.error("خطأ في حذف القسم:", error);
        showToast("error", "حدث خطأ في حذف القسم");
        hideConfirmModal();
      } finally {
        setDeleteSectionLoading(false);
        setConfirmModal((prev) => {
          return { ...prev, loading: false };
        });
      }
    };

    showConfirmModal(
      "حذف القسم",
      "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الفيديوهات والملفات المرتبطة به.",
      performDelete,
      "danger"
    );
  };

  // Video Functions
  const openVideoModal = (sectionId: string) => {
    setShowVideoModal(true);
    setCurrentSectionId(sectionId);
    setNewVideoTitle("");
    setNewVideoDescription("");
    setNewVideoDuration("");
    setNewVideoFile(null);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setCurrentSectionId("");
    setNewVideoTitle("");
    setNewVideoDescription("");
    setNewVideoDuration("");
    setNewVideoFile(null);
  };

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewVideoFile(file);
  };

  const addVideo = async () => {
    if (!newVideoTitle.trim()) {
      showToast("error", "يرجى إدخال عنوان للفيديو");
      return;
    }

    if (!newVideoFile) {
      showToast("error", "يرجى اختيار ملف الفيديو");
      return;
    }

    if (!newVideoDescription.trim()) {
      showToast("error", "يرجى إدخال وصف للفيديو");
      return;
    }

    if (!newVideoDuration.trim()) {
      showToast("error", "يرجى إدخال مدة الفيديو");
      return;
    }

    setAddVideoLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newVideoTitle.trim());
      formData.append("description", newVideoDescription.trim());
      formData.append("duration", newVideoDuration.trim());
      formData.append("file", newVideoFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${currentSectionId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      setSections(
        response.data.sections ||
          sections.map((section) =>
            section._id === currentSectionId
              ? { ...section, videos: [...section.videos, response.data.video] }
              : section
          )
      );

      showToast("success", "تم إضافة الفيديو بنجاح");
      closeVideoModal();
    } catch (error) {
      console.error("خطأ في إضافة الفيديو:", error);
      showToast("error", "حدث خطأ في إضافة الفيديو");
    } finally {
      setAddVideoLoading(false);
    }
  };

  const updateVideo = async (
    sectionId: string,
    videoId: string,
    newTitle: string
  ) => {
    setEditVideoLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${sectionId}/videos/${videoId}`,
        {
          title: newTitle,
        },
        {
          withCredentials: true,
        }
      );

      setSections(
        sections.map((section) =>
          section._id === sectionId
            ? {
                ...section,
                videos: section.videos.map((video) =>
                  video._id === videoId
                    ? { ...video, lessonTitle: newTitle }
                    : video
                ),
              }
            : section
        )
      );
      setEditingVideoId(null);
      showToast("success", "تم تحديث الفيديو بنجاح");
    } catch (error) {
      console.error("خطأ في تحديث الفيديو:", error);
      showToast("error", "حدث خطأ في تحديث الفيديو");
    } finally {
      setEditVideoLoading(false);
    }
  };

  const deleteVideo = async (sectionId: string, videoId: string) => {
    const performDelete = async () => {
      setDeleteVideoLoading(true);
      setConfirmModal((prev) => {
        return { ...prev, loading: true };
      });
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${sectionId}/videos/${videoId}`,
          {
            withCredentials: true,
          }
        );

        setSections(
          sections.map((section) =>
            section._id === sectionId
              ? {
                  ...section,
                  videos: section.videos.filter(
                    (video) => video._id !== videoId
                  ),
                }
              : section
          )
        );
        showToast("success", "تم حذف الفيديو بنجاح");
        hideConfirmModal();
      } catch (error) {
        console.error("خطأ في حذف الفيديو:", error);
        showToast("error", "حدث خطأ في حذف الفيديو");
        hideConfirmModal();
      } finally {
        setDeleteVideoLoading(false);
        setConfirmModal((prev) => {
          return { ...prev, loading: false };
        });
      }
    };

    showConfirmModal(
      "حذف الفيديو",
      "هل أنت متأكد من حذف هذا الفيديو؟ سيتم حذف جميع الملفات المرتبطة به أيضاً.",
      performDelete,
      "danger"
    );
  };

  // File Functions
  const openFileModal = (videoId: string) => {
    setShowFileModal(true);
    setCurrentVideoId(videoId);
    setNewFileName("");
    setNewFile(null);
  };

  const closeFileModal = () => {
    setShowFileModal(false);
    setCurrentVideoId("");
    setNewFileName("");
    setNewFile(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewFile(file);
  };

  const addFile = async () => {
    if (!newFileName.trim()) {
      showToast("error", "يرجى إدخال اسم للملف");
      return;
    }

    if (!newFile) {
      showToast("error", "يرجى اختيار ملف");
      return;
    }

    setAddFileLoading(true);
    try {
      const formData = new FormData();
      formData.append("filename", newFileName.trim());
      formData.append("file", newFile);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${currentSectionId}/videos/${currentVideoId}/files`,
        formData,
        {
          withCredentials: true,
        }
      );

      setSections(
        sections.map((section) =>
          section._id === currentSectionId
            ? {
                ...section,
                videos: section.videos.map((video) =>
                  video._id === currentVideoId
                    ? {
                        ...video,
                        files: [...(video.files || []), response.data.file],
                      }
                    : video
                ),
              }
            : section
        )
      );

      showToast("success", "تم إضافة الملف بنجاح");
      closeFileModal();
    } catch (error) {
      console.error("خطأ في إضافة الملف:", error);
      showToast("error", "حدث خطأ في إضافة الملف");
    } finally {
      setAddFileLoading(false);
    }
  };

  const deleteFile = async (
    sectionId: string,
    videoId: string,
    fileId: string
  ) => {
    const performDelete = async () => {
      setDeleteFileLoading(true);
      setConfirmModal((prev) => {
        return { ...prev, loading: true };
      });
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}/sections/${sectionId}/videos/${videoId}/files/${fileId}`,
          {
            withCredentials: true,
          }
        );

        setSections(
          sections.map((section) =>
            section._id === sectionId
              ? {
                  ...section,
                  videos: section.videos.map((video) =>
                    video._id === videoId
                      ? {
                          ...video,
                          files: (video.files || []).filter(
                            (file) => file._id !== fileId
                          ),
                        }
                      : video
                  ),
                }
              : section
          )
        );
        showToast("success", "تم حذف الملف بنجاح");
        hideConfirmModal();
      } catch (error) {
        console.error("خطأ في حذف الملف:", error);
        showToast("error", "حدث خطأ في حذف الملف");
        hideConfirmModal();
      } finally {
        setDeleteFileLoading(false);
        setConfirmModal((prev) => {
          return { ...prev, loading: false };
        });
      }
    };

    showConfirmModal(
      "حذف الملف",
      "هل أنت متأكد من حذف هذا الملف؟",
      performDelete,
      "danger"
    );
  };

  const toggleVideoExpansion = (videoId: string) => {
    const newExpandedVideos = new Set(expandedVideos);
    if (expandedVideos.has(videoId)) {
      newExpandedVideos.delete(videoId);
    } else {
      newExpandedVideos.add(videoId);
    }
    setExpandedVideos(newExpandedVideos);
  };

  const handleEditCourse = async () => {
    setEditeCourseLoading(true);
    const formData = new FormData();
    formData.append("title", courseData?.title);
    formData.append("description", courseData?.description);
    formData.append("price", courseData?.price.toString());
    formData.append("category", courseData?.category);
    if (courseData?.imageCover) {
      formData.append("imageCover", courseData?.imageCover);
    }
    concepts.map((concept, index) => {
      formData.append(`concepts[${index}]`, concept);
    });

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${course?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // مهم جدًا عند إرسال ملفات
          },
        }
      );

      setCourse(res.data.course);
      setCourseData(res.data.course);
      showToast("success", res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setEditeCourseLoading(false);
    }
  };
  // add edit the description of video 
  // تعديل أماكن الدروس و الأقسام
  return (
    <div className="min-h-screen  p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                تعديل الكورس
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                إدارة وتعديل محتوى الكورس بسهولة
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className={`flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg
          ${
            editeCourseLoading
              ? "bg-mainColorHoverLight cursor-not-allowed disabled:opacity-50"
              : "bg-mainColor hover:bg-mainColorHoverLight cursor-pointer"
          }
          `}
                onClick={async () => {
                  if (activeTab === "details") {
                    try {
                      await handleEditCourse();
                      setActiveTab("sections"); // فقط إذا نجح التحديث
                    } catch (error) {
                      console.error("Failed to edit course:", error);
                      // يمكن عرض toast هنا
                    }
                  } else {
                    router.push(`/course/${course?._id}`);
                  }
                }}
                disabled={editeCourseLoading}
              >
                {editeCourseLoading ? (
                  <Loader2
                    className="animate-spin text-center w-full"
                    size={22}
                  />
                ) : (
                  <>
                    <Save size={22} />
                    <p>حفظ التغييرات</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-300 border-b-2
            ${
              activeTab === tab.id
                ? "border-[#3D45EE] text-[#3D45EE] bg-[#B9BCFF]/20 dark:bg-gray-800"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-[#3D45EE] dark:hover:text-[#6A78FB] hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700">
          {/* تفاصيل الكورس */}
          {activeTab === "details" && (
            <div className="p-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#B9BCFF]/30 rounded-lg dark:bg-indigo-900/30">
                  <BookOpen className="text-[#3D45EE]" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  تفاصيل الكورس
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* العمود الأيسر */}
                <div className="space-y-6">
                  {/* العنوان */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Edit3 size={16} />
                      عنوان الكورس
                    </label>
                    <input
                      type="text"
                      value={courseData.title || course?.title || ""}
                      onChange={handleInputChange}
                      name="title"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                      placeholder="أدخل عنوان الكورس"
                    />
                  </div>

                  {/* الوصف */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FileText size={16} />
                      وصف الكورس
                    </label>
                    <textarea
                      value={
                        courseData.description || course?.description || ""
                      }
                      onChange={handleInputChange}
                      name="description"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="أدخل وصف مفصل للكورس"
                    />
                  </div>

                  {/* السعر والفئة */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <DollarSign size={16} />
                        السعر (DZD)
                      </label>
                      <input
                        type="number"
                        value={courseData.price || course?.price || ""}
                        onChange={handleInputChange}
                        name="price"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Tag size={16} />
                        الفئة
                      </label>
                      <select
                        value={courseData.category || course?.category || ""}
                        onChange={handleInputChange}
                        name="category"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* العمود الأيمن */}
                <div className="space-y-6">
                  {/* صورة الكورس */}
                  <div>
                    <label className="flex flex-col border-2 border-dashed cursor-pointer border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#3D45EE] transition-colors duration-300">
                      <Upload
                        className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
                        size={48}
                      />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        اسحب الصورة هنا أو انقر للاختيار
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageCoverChange}
                      />
                    </label>
                  </div>
                  {/* معاينة الصورة */}
                  {imageCoverPreview && (
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 apply-fonts-normal">
                        معاينة الصورة:
                      </p>
                      <Image
                        src={imageCoverPreview}
                        alt="صورة الغلاف"
                        className="w-[500px] h-[322px] rounded-2xl border-2 border-gray-200 dark:border-gray-700"
                        width={550}
                        height={550}
                      />
                    </div>
                  )}
                  {/* المفاهيم */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Settings size={16} />
                      مفاهيم الكورس
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                        placeholder="أضف مفهوم جديد"
                      />
                      <button
                        onClick={addConcept}
                        className="bg-[#45DA10] text-white px-4 py-2 rounded-lg hover:bg-[#3BC50C] transition-colors duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {concepts.length > 0 ? (
                        concepts.map((concept, index) => (
                          <span
                            key={index}
                            className="bg-[#B9BCFF]/30 dark:bg-indigo-900/30 text-[#3D45EE] px-3 py-1 rounded-full text-sm flex items-center gap-2 group hover:bg-[#B9BCFF]/50 dark:hover:bg-indigo-900/50 transition-colors duration-300"
                          >
                            {concept}
                            <button
                              onClick={() => removeConcept(index)}
                              className="text-[#3D45EE] hover:text-[#EE3D45] transition-colors duration-300"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <h1 className="text-gray-500 dark:text-gray-400">
                          لا توجد أي مفاهيم
                        </h1>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* الأقسام والفيديوهات */}
          {activeTab === "sections" && (
            <div className="p-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF6636]/10 rounded-lg dark:bg-orange-900/30">
                    <Video className="text-[#FF6636]" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    الأقسام والفيديوهات
                  </h2>
                </div>
                <button
                  onClick={openSectionModal}
                  className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    addSectionLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FF6636] hover:bg-[#E55529]"
                  }`}
                >
                  {addSectionLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                  {addSectionLoading ? "جاري الإضافة..." : "إضافة قسم"}
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section) => (
                  <div
                    key={section._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-950 px-6 py-4 border-b dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FolderOpen className="text-[#FF6636]" size={20} />
                          {editingSectionId === section._id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={editingSectionTitle}
                                onChange={(e) =>
                                  setEditingSectionTitle(e.target.value)
                                }
                                className="text-lg font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3D45EE] rounded px-3 py-2 flex-1"
                                placeholder="عنوان القسم"
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  if (
                                    editingSectionTitle.trim() ===
                                    section.title.trim()
                                  ) {
                                    showToast("info", "العنوان لم يتغير");
                                    setEditSectionLoading(false);
                                    return;
                                  }

                                  updateSection(
                                    section._id,
                                    editingSectionTitle
                                  );
                                }}
                                disabled={editSectionLoading}
                                className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                                  editSectionLoading
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {editSectionLoading ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Save size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSectionId(null);
                                  setEditingSectionTitle("");
                                }}
                                disabled={editSectionLoading}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <h3
                              className="text-lg font-semibold cursor-pointer text-gray-800 dark:text-gray-100 hover:text-[#3D45EE] dark:hover:text-[#6A78FB] transition-colors duration-300"
                              onClick={() => {
                                setEditingSectionId(section._id);
                                setEditingSectionTitle(section.title);
                              }}
                            >
                              {section.title}
                            </h3>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openVideoModal(section._id)}
                            className="flex items-center gap-2 bg-[#45DA10] hover:bg-[#3BC50C] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                          >
                            <Plus size={16} />
                            إضافة فيديو
                          </button>
                          <button
                            onClick={() => {
                              setEditingSectionId(section._id);
                              setEditingSectionTitle(section.title);
                            }}
                            className="text-[#3D45EE] hover:text-[#2E36C0] p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-300"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteSection(section._id)}
                            disabled={deleteSectionLoading}
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              deleteSectionLoading
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#EE3D45] hover:text-[#FF5F68] hover:bg-red-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            {deleteSectionLoading ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="space-y-3">
                        {section.videos.map((video) => (
                          <div
                            key={video._id}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                          >
                            {/* Video Header */}
                            <div className="flex items-center gap-4 p-4">
                              <PlayCircle
                                className="text-[#3D45EE] flex-shrink-0"
                                size={20}
                              />
                              <div className="flex-1">
                                {editingVideoId === video._id ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={editingVideoTitle}
                                      onChange={(e) =>
                                        setEditingVideoTitle(e.target.value)
                                      }
                                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300 flex-1"
                                      placeholder="عنوان الدرس"
                                      autoFocus
                                    />
                                    <button
                                      onClick={async () =>
                                        await updateVideo(
                                          section._id,
                                          video._id,
                                          editingVideoTitle
                                        )
                                      }
                                      disabled={editVideoLoading}
                                      className={`px-3 py-2 rounded-lg transition-colors duration-300 ${
                                        editVideoLoading
                                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                          : "bg-green-500 hover:bg-green-600 text-white"
                                      }`}
                                    >
                                      {editVideoLoading ? (
                                        <Loader2
                                          className="animate-spin"
                                          size={16}
                                        />
                                      ) : (
                                        <Save size={16} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingVideoId(null);
                                        setEditingVideoTitle("");
                                      }}
                                      disabled={editVideoLoading}
                                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <h4
                                    className="font-medium cursor-pointer text-gray-800 dark:text-gray-100 hover:text-[#3D45EE] dark:hover:text-[#6A78FB] transition-colors duration-300"
                                    onClick={() => {
                                      setEditingVideoId(video._id);
                                      setEditingVideoTitle(video.lessonTitle);
                                    }}
                                  >
                                    {video.lessonTitle}
                                  </h4>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {video.files && video.files.length > 0 && (
                                  <span className="bg-[#0DC7B1]/10 dark:bg-cyan-900/30 text-[#0DC7B1] dark:text-cyan-400 px-2 py-1 rounded-full text-xs">
                                    {video.files.length} ملف
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    openFileModal(video._id);
                                    setCurrentSectionId(section._id);
                                  }}
                                  className="bg-[#0DC7B1] hover:bg-[#0BB5A0] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                                  title="إضافة ملف"
                                >
                                  <Plus size={16} />
                                </button>
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#3D45EE] hover:bg-[#2E36C0] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                                  title="عرض الفيديو"
                                >
                                  <Link size={16} />
                                </a>
                                <button
                                  onClick={() =>
                                    toggleVideoExpansion(video._id)
                                  }
                                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg transition-colors duration-300"
                                  title={
                                    expandedVideos.has(video._id)
                                      ? "إخفاء الملفات"
                                      : "عرض الملفات"
                                  }
                                >
                                  {expandedVideos.has(video._id) ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingVideoId(video._id);
                                    setEditingVideoTitle(video.lessonTitle);
                                  }}
                                  className="text-[#3D45EE] hover:text-[#2E36C0] p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-300"
                                  title="تعديل الفيديو"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteVideo(section._id, video._id)
                                  }
                                  disabled={deleteVideoLoading}
                                  className={`p-2 rounded-lg transition-colors duration-300 ${
                                    deleteVideoLoading
                                      ? "text-gray-400 cursor-not-allowed"
                                      : "text-[#EE3D45] hover:text-[#FF5F68] hover:bg-red-50 dark:hover:bg-gray-800"
                                  }`}
                                  title="حذف الفيديو"
                                >
                                  {deleteVideoLoading ? (
                                    <Loader2
                                      className="animate-spin"
                                      size={16}
                                    />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Files Section */}
                            {expandedVideos.has(video._id) && (
                              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <File className="text-[#0DC7B1]" size={16} />
                                  <h5 className="font-medium text-gray-700 dark:text-gray-200">
                                    الملفات المرفقة
                                  </h5>
                                </div>

                                {video.files && video.files.length > 0 ? (
                                  <div className="space-y-2">
                                    {video.files.map((file) => (
                                      <div
                                        key={file._id}
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg group hover:shadow-sm transition-all duration-300"
                                      >
                                        <div className="p-2 bg-[#0DC7B1]/10 dark:bg-cyan-900/30 rounded-lg">
                                          <File
                                            className="text-[#0DC7B1]"
                                            size={16}
                                          />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800 dark:text-gray-100">
                                            {file.filename}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[#0DC7B1] hover:bg-[#0BB5A0] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                                            title="تحميل الملف"
                                          >
                                            <Link size={14} />
                                          </a>
                                          <button
                                            onClick={() =>
                                              deleteFile(
                                                section._id,
                                                video._id,
                                                file._id
                                              )
                                            }
                                            disabled={DeleteFileLoading}
                                            className={`p-2 rounded-lg transition-colors duration-300 opacity-0 group-hover:opacity-100 ${
                                              DeleteFileLoading
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-[#EE3D45] hover:text-[#FF5F68] hover:bg-red-50 dark:hover:bg-gray-800"
                                            }`}
                                            title="حذف الملف"
                                          >
                                            {DeleteFileLoading ? (
                                              <Loader2
                                                className="animate-spin"
                                                size={14}
                                              />
                                            ) : (
                                              <Trash2 size={14} />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    <File className="mx-auto mb-2" size={24} />
                                    <p className="text-sm">
                                      لا توجد ملفات مرفقة
                                    </p>
                                    <button
                                      onClick={() => {
                                        openFileModal(video._id);
                                        setCurrentSectionId(section._id);
                                      }}
                                      className="text-[#0DC7B1] hover:text-[#0BB5A0] text-sm mt-1"
                                    >
                                      إضافة ملف جديد
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {section.videos.length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Video className="mx-auto mb-2" size={32} />
                            <p>لا توجد فيديوهات في هذا القسم</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FolderOpen className="mx-auto mb-4" size={48} />
                    <p className="text-lg mb-2">لا توجد أقسام بعد</p>
                    <p className="text-sm">
                      {`انقر على "إضافة قسم" لبدء إنشاء محتوى الكورس`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={hideConfirmModal}
          type={confirmModal.type}
          loading={confirmModal.loading}
        />

        {/* Section Modal */}
        {showSectionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-modal">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF6636]/10 rounded-lg dark:bg-orange-900/30">
                    <FolderOpen className="text-[#FF6636]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    إضافة قسم جديد
                  </h3>
                </div>
                <button
                  onClick={closeSectionModal}
                  disabled={addSectionLoading}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Edit3 size={16} />
                    عنوان القسم
                  </label>
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#FF6636] focus:border-transparent transition-all duration-300"
                    placeholder="أدخل عنوان القسم"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !addSectionLoading) {
                        addSection();
                      }
                    }}
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    سيتم إضافة هذا القسم إلى الكورس ويمكنك إضافة الفيديوهات إليه
                    لاحقاً
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={closeSectionModal}
                    disabled={addSectionLoading}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={addSection}
                    disabled={addSectionLoading || !newSectionTitle.trim()}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      addSectionLoading || !newSectionTitle.trim()
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                        : "bg-[#FF6636] hover:bg-[#E55529] text-white shadow-lg"
                    }`}
                  >
                    {addSectionLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        جاري الإضافة...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        إضافة القسم
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl transform animate-modal max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#3D45EE]/10 rounded-lg dark:bg-indigo-900/30">
                    <Video className="text-[#3D45EE]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    إضافة فيديو جديد
                  </h3>
                </div>
                <button
                  onClick={closeVideoModal}
                  disabled={addVideoLoading}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Video Title Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Edit3 size={16} />
                    عنوان الفيديو <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                    placeholder="أدخل عنوان الفيديو"
                    autoFocus
                  />
                </div>

                {/* Video Description Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <FileText size={16} />
                    وصف الفيديو <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newVideoDescription}
                    onChange={(e) => setNewVideoDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="أدخل وصف مفصل للفيديو"
                  />
                </div>

                {/* Video Duration Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Clock size={16} />
                    مدة الفيديو <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#3D45EE] focus:border-transparent transition-all duration-300"
                    placeholder="مثال: 15:30 أو 10 دقائق"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    أدخل مدة الفيديو بالشكل المناسب (مثال: 15:30 أو 10 دقائق)
                  </p>
                </div>

                {/* Video File Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Upload size={16} />
                    ملف الفيديو <span className="text-red-500">*</span>
                  </label>
                  <label
                    className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-lg 
              cursor-pointer transition-all duration-300
              ${
                addVideoLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#3D45EE] hover:bg-[#3D45EE]/5"
              }
              ${
                newVideoFile?.name
                  ? "border-[#3D45EE] bg-[#3D45EE]/5 dark:bg-indigo-900/10"
                  : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              }
            `}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload
                        className={`mb-3 ${
                          newVideoFile?.name
                            ? "text-[#3D45EE]"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                        size={24}
                      />
                      {newVideoFile?.name ? (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            تم اختيار الملف:
                          </p>
                          <p className="text-sm text-[#3D45EE] dark:text-[#6A78FB] font-semibold">
                            {newVideoFile?.name}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">اضغط للرفع</span> أو
                            اسحب وأفلت
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            MP4, WebM أو AVI (الحد الأقصى: 500MB)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleVideoFileChange}
                      accept="video/*"
                      disabled={addVideoLoading}
                    />
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 rounded-b-2xl">
                <button
                  onClick={closeVideoModal}
                  disabled={addVideoLoading}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إلغاء
                </button>
                <button
                  onClick={addVideo}
                  disabled={
                    addVideoLoading ||
                    !newVideoTitle.trim() ||
                    !newVideoDescription.trim() ||
                    !newVideoDuration.trim() ||
                    !newVideoFile
                  }
                  className={`
            flex items-center gap-2 px-6 py-2 rounded-lg 
            transition-all duration-300 transform hover:scale-105
            ${
              addVideoLoading ||
              !newVideoTitle.trim() ||
              !newVideoDescription.trim() ||
              !newVideoDuration.trim() ||
              !newVideoFile
                ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-[#3D45EE] hover:bg-[#2E36C0] text-white shadow-lg"
            }
          `}
                >
                  {addVideoLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      إضافة الفيديو
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Modal */}
        {showFileModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-modal">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0DC7B1]/10 rounded-lg dark:bg-cyan-900/30">
                    <File className="text-[#0DC7B1]" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    إضافة ملف جديد
                  </h3>
                </div>
                <button
                  onClick={closeFileModal}
                  disabled={addFileLoading}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* File Name Input */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Edit3 size={16} />
                    اسم الملف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-[#0DC7B1] focus:border-transparent transition-all duration-300"
                    placeholder="أدخل اسم الملف"
                    autoFocus
                  />
                  {newFile && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">الملف المختار:</span>{" "}
                        {newFile.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    <Upload size={16} />
                    الملف <span className="text-red-500">*</span>
                  </label>
                  <label
                    className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-lg 
              cursor-pointer transition-all duration-300
              ${
                addFileLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-[#0DC7B1] hover:bg-[#0DC7B1]/5"
              }
              ${
                newFile?.name
                  ? "border-[#0DC7B1] bg-[#0DC7B1]/5 dark:bg-cyan-900/10"
                  : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              }
            `}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload
                        className={`mb-3 ${
                          newFile?.name
                            ? "text-[#0DC7B1]"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                        size={24}
                      />
                      {newFile?.name ? (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            تم اختيار الملف:
                          </p>
                          <p className="text-sm text-[#0DC7B1] dark:text-cyan-400 font-semibold">
                            {newFile?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            الحجم: {(newFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">اضغط للرفع</span> أو
                            اسحب وأفلت
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOC, DOCX, PPT, TXT أو أي نوع ملف
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={addFileLoading}
                    />
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={closeFileModal}
                    disabled={addFileLoading}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={addFile}
                    disabled={addFileLoading || !newFileName.trim() || !newFile}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      addFileLoading || !newFileName.trim() || !newFile
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                        : "bg-[#0DC7B1] hover:bg-[#0BB5A0] text-white shadow-lg"
                    }`}
                  >
                    {addFileLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        جاري الإضافة...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        إضافة الملف
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modal {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-modal {
          animation: modal 0.3s ease-out forwards;
        }

        /* Custom scrollbar for modal */
        .max-h-\[90vh\]::-webkit-scrollbar {
          width: 6px;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default CourseEditPage;
