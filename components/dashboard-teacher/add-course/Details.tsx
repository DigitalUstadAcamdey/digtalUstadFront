"use client";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import showToast from "@/utils/showToast";
import axios from "axios";
import {
  Loader,
  X,
  Upload,
  FileText,
  Video,
  Trash2,
  Plus,
  Eye,
  AlertTriangle,
  Info,
} from "lucide-react";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface CourseDetails {
  title: string;
  description: string;
  category: string;
  price: number;
  imageCover: File | null;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  sections: Section[];
  price: number;
  category: string;
  studentsCount: number;
  imageCover: string;
  enrolledStudents: string[];
  reviews: string[];
  numberRatings: number;
  avgRatings: number;
  concepts: string[];
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
}

type Section = {
  _id: string;
  title: string;
  videos: Videos[];
};

interface UploadedFile {
  _id: string;
  filename: string;
  url: string;
  size: number;
}

interface Videos {
  _id: string;
  lessonTitle: string;
  url: string;
  format: string;
  duration: number;
  uploadedBy: string;
  sectionId: string;
  isCompleted: string;
  completedBy: string[];
  comments: string[];
  files: UploadedFile[];
  createdAt: string;
  publishedDate: string;
}

interface VideoUpload {
  title: string;
  file: File | null;
  duration: string;
  description: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL;

export default function CourseUploader() {
  const router = useRouter();
  // stepre
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));

  // step one create course details
  const [newconcept, setNewConcept] = useState<string>("");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    imageCover: null,
    title: "",
    price: 0,
    description: "",
    category: "",
  });
  const [currentCourse, setCurrentCourse] = useState<Course>({
    _id: "",
    title: "",
    description: "",
    instructor: "",
    sections: [],
    price: 0,
    category: "",
    studentsCount: 0,
    imageCover: "",
    enrolledStudents: [],
    reviews: [],
    numberRatings: 0,
    avgRatings: 0,
    concepts: [],
    publishedDate: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loadingCreatingCourse, setloadingCreatingCourse] = useState(false);
  const [loadingAddSection, setloadingAddSection] = useState(false);
  const [loadingAddVideoToSection, setloadingAddVideoToSection] =
    useState(false);
  const [loadingDeleteVideo, setLoadingDeleteVideo] = useState<string>("");
  const [loadingUploadFile, setLoadingUploadFile] = useState<string>("");
  const [loadingDeleteCourse, setLoadingDeleteCourse] = useState(false);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState(false);
  const [deleteFileLoading, setDeleteFileLoading] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    type: "video" | "file" | "course" | "section";
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // concepts
  const addConcept = (concept: string) => {
    if (concept.trim() === "") return;
    setConcepts((prev) => [...prev, concept]);
  };
  const removeConcept = (index: number) => {
    setConcepts(
      concepts.filter((concept: string, i: number) => {
        return i !== index;
      })
    );
  };

  const handleCreateCourse = async () => {
    // check before send
    if (!courseDetails.title?.trim()) {
      showToast("error", "الرجاء إدخال عنوان الكورس");
      return;
    }
    if (!courseDetails.description?.trim()) {
      showToast("error", "الرجاء إدخال وصف الكورس");
      return;
    }
    if (!courseDetails.price || isNaN(Number(courseDetails.price))) {
      showToast("error", "الرجاء إدخال سعر صحيح");
      return;
    }
    if (!courseDetails.imageCover) {
      showToast("error", "الرجاء اختيار صورة غلاف");
      return;
    }
    if (!concepts || concepts.length === 0) {
      showToast("error", "الرجاء إضافة مفهوم واحد على الأقل");
      return;
    }

    setloadingCreatingCourse(true);
    const formData = new FormData();

    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("price", String(courseDetails.price));
    if (courseDetails.imageCover) {
      formData.append("imageCover", courseDetails.imageCover);
    }

    if (concepts && concepts.length > 0) {
      concepts.forEach((concept: string, index: number) => {
        formData.append(`concepts[${index}]`, concept);
      });
    }

    try {
      const res = await axios.post(`${baseUrl}/api/courses`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("success", res.data.message);
      setCurrentCourse(res.data.course);
      sessionStorage.setItem("course_id", res.data.course._id);
      nextStep();
    } catch (error) {
      console.error("Error creating course:", error);
      showToast("error", "حدث خطأ أثناء إنشاء الكورس");
    } finally {
      setloadingCreatingCourse(false);
    }
  };

  // step two create course sections
  const [sections, setSections] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const handleAddSctions = async () => {
    if (!title.trim()) {
      showToast("error", "الرجاء إدخال عنوان القسم");
      return;
    }
    setloadingAddSection(true);
    try {
      const res = await axios.post(
        `${baseUrl}/api/courses/${currentCourse._id}`,
        {
          sectionTitle: title,
        },
        { withCredentials: true }
      );
      showToast("success", res.data.message);
      setCurrentCourse({
        ...currentCourse,
        sections: [...currentCourse.sections, res.data.section._id],
      });
      setSections([...sections, res.data.section]);

      setTitle(""); // Clear input after successful addition
    } catch (error) {
      console.log(error);
      showToast("error", "حدث خطأ أثناء إنشاء القسم");
    } finally {
      setloadingAddSection(false);
    }
  };
  const handleDeleteSection = async (sectionId: string) => {
    setDeleteSectionLoading(true);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${currentCourse?._id}/sections/${sectionId}`,
        {
          withCredentials: true,
        }
      );

      setSections(sections.filter((section) => section._id !== sectionId));
      showToast("success", "تم حذف القسم بنجاح");
    } catch (error) {
      console.error("خطأ في حذف القسم:", error);
      showToast("error", "حدث خطأ في حذف القسم");
    } finally {
      setDeleteSectionLoading(false);
    }
  };

  // step three add videos to sections and files to videos
  const addVideoToSection = async (
    sectionId: string,
    title: string,
    file: File,
    duration: string,
    description: string
  ) => {
    if (!sectionId?.trim()) {
      showToast("error", "الرجاء اختيار القسم أولا");
      return;
    }
    if (!title?.trim()) {
      showToast("error", "الرجاء إدخال عنوان الدرس");
      return;
    }
    if (!description?.trim()) {
      showToast("error", "الرجاء إدخال وصف الدرس");
      return;
    }
    if (!file) {
      showToast("error", "الرجاء رفع الفيديو");
      return;
    }
    if (!duration?.trim()) {
      showToast("error", "الرجاء وضع مدة الفيديو");
      return;
    }
    setloadingAddVideoToSection(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("duration", String(duration));
    formData.append("description", description);

    try {
      const res = await axios.post(
        `${baseUrl}/api/courses/${currentCourse._id}/sections/${sectionId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast("success", res.data.message);
      setSections((prevSections) =>
        prevSections.map((sec) =>
          sec._id === sectionId
            ? { ...sec, videos: [...sec.videos, res.data.video] }
            : sec
        )
      );
    } catch (error) {
      console.error("Error uploading video:", error);
      showToast("error", "حدث خطأ أثناء رفع الفيديو");
    } finally {
      setloadingAddVideoToSection(false);
    }
  };

  // Delete video
  const deleteVideo = async (sectionId: string, videoId: string) => {
    setLoadingDeleteVideo(videoId);
    try {
      await axios.delete(
        `${baseUrl}/api/courses/${currentCourse._id}/sections/${sectionId}/videos/${videoId}`,
        { withCredentials: true }
      );
      showToast("success", "تم حذف الفيديو بنجاح");
      setSections((prevSections) =>
        prevSections.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                videos: sec.videos.filter((video) => video._id !== videoId),
              }
            : sec
        )
      );
    } catch (error) {
      console.error("Error deleting video:", error);
      showToast("error", "حدث خطأ أثناء حذف الفيديو");
    } finally {
      setLoadingDeleteVideo("");
      setShowDeleteModal(false);
    }
  };

  // Add file to video
  const addFileToVideo = async (
    sectionId: string,
    videoId: string,
    fileName: string,
    file: File
  ) => {
    if (!fileName.trim()) {
      showToast("error", "الرجاء إدخال إسم الملف");
      return;
    }
    if (!file) {
      showToast("error", "الرجاء اختيار الملف");
      return;
    }

    setLoadingUploadFile(videoId);
    const formData = new FormData();
    formData.append("filename", fileName);
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${baseUrl}/api/courses/${currentCourse._id}/sections/${sectionId}/videos/${videoId}/files`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast("success", res.data.message);

      // Update the sections state to include the new file
      setSections((prevSections) =>
        prevSections.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                videos: sec.videos.map((video) =>
                  video._id === videoId
                    ? { ...video, files: [...video.files, res.data.file] }
                    : video
                ),
              }
            : sec
        )
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast("error", "حدث خطأ أثناء رفع الملف");
    } finally {
      setLoadingUploadFile("");
    }
  };

  // Delete file from video
  const deleteFileFromVideo = async (
    sectionId: string,
    videoId: string,
    fileId: string
  ) => {
    setDeleteFileLoading(true);
    try {
      await axios.delete(
        `${baseUrl}/api/courses/${currentCourse._id}/sections/${sectionId}/videos/${videoId}/files/${fileId}`,
        { withCredentials: true }
      );
      showToast("success", "تم حذف الملف بنجاح");

      // Update the sections state to remove the file
      setSections((prevSections) =>
        prevSections.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                videos: sec.videos.map((video) =>
                  video._id === videoId
                    ? {
                        ...video,
                        files: video.files.filter(
                          (file) => file._id !== fileId
                        ),
                      }
                    : video
                ),
              }
            : sec
        )
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      showToast("error", "حدث خطأ أثناء حذف الملف");
    } finally {
      setShowDeleteModal(false);
      setDeleteFileLoading(false);
    }
  };

  // Delete entire course
  const deleteCourse = async () => {
    setLoadingDeleteCourse(true);
    try {
      await axios.delete(`${baseUrl}/api/courses/${currentCourse._id}`, {
        withCredentials: true,
      });
      showToast("success", "تم حذف الكورس بنجاح");
      // Reset all states
      setStep(1);
      setCurrentCourse({
        _id: "",
        title: "",
        description: "",
        instructor: "",
        sections: [],
        price: 0,
        category: "",
        studentsCount: 0,
        imageCover: "",
        enrolledStudents: [],
        reviews: [],
        numberRatings: 0,
        avgRatings: 0,
        concepts: [],
        publishedDate: "",
        createdAt: "",
        updatedAt: "",
      });
      setSections([]);
      setConcepts([]);
      setCourseDetails({
        imageCover: null,
        title: "",
        price: 0,
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("error", "حدث خطأ أثناء حذف الكورس");
    } finally {
      setLoadingDeleteCourse(false);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = (
    type: "video" | "file" | "course" | "section",
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setDeleteModalConfig({ type, title, message, onConfirm });
    setShowDeleteModal(true);
  };
  const fetchCourseAfterPublished = async () => {
    try {
      const courseId = sessionStorage.getItem("course_id")
        ? sessionStorage.getItem("course_id")
        : currentCourse?._id;
      if (!courseId) {
        throw new Error("Course ID is missing.");
      }
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/courses/${courseId}`,
        {
          withCredentials: true,
        }
      );
      const course = res.data.course;
      setCurrentCourse(course);
    } catch (error) {
      throw error;
    }
  };

  // save the id in local sotrage when user is loading page
  return (
    <div className="min-h-screen  transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 p-8 text-white">
            <h1 className="text-3xl font-bold apply-fonts-normal mb-2">
              إنشاء كورس جديد
            </h1>
            <p className="text-indigo-100 dark:text-indigo-200 apply-fonts-normal">
              قم بإنشاء وتنظيم محتوى الكورس الخاص بك
            </p>
          </div>

          <div className="p-8">
            {/* Stepper */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
              {["تفاصيل عامة", "الأقسام و الفيديوهات", "نشر الكورس"].map(
                (label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step === index + 1
                          ? "bg-indigo-600 text-white shadow-lg transform scale-110"
                          : step > index + 1
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step > index + 1 ? "✓" : index + 1}
                    </div>
                    <span
                      className={`mt-3 text-sm font-medium apply-fonts-normal transition-colors ${
                        step === index + 1
                          ? "text-indigo-600 dark:text-indigo-400"
                          : step > index + 1
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Step Content */}
            {step === 1 && (
              <StepGeneralDetails
                courseDetails={courseDetails}
                setCourseDetails={setCourseDetails}
                concepts={concepts}
                setNewConcept={setNewConcept}
                newconcept={newconcept}
                addConcept={addConcept}
                removeConcept={removeConcept}
              />
            )}
            {step === 2 && (
              <StepSectionsAndVideos
                sections={sections}
                loadingAddSection={loadingAddSection}
                currentCourse={currentCourse}
                handleAddSctions={handleAddSctions}
                handleDeleteSction={handleDeleteSection}
                deleteSectionLoading={deleteSectionLoading}
                title={title}
                setTitle={setTitle}
                addVideoToSection={addVideoToSection}
                loadingAddVideoToSection={loadingAddVideoToSection}
                deleteVideo={deleteVideo}
                loadingDeleteVideo={loadingDeleteVideo}
                addFileToVideo={addFileToVideo}
                deleteFileFromVideo={deleteFileFromVideo}
                loadingUploadFile={loadingUploadFile}
                openDeleteModal={openDeleteModal}
              />
            )}
            {step === 3 && <StepPublish currentCourse={currentCourse} />}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              {/* Back Button with Tooltip */}
              <div className="relative group">
                <button
                  disabled
                  className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-xl font-medium apply-fonts-normal cursor-not-allowed flex items-center gap-2 relative"
                >
                  رجوع
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  <div className="apply-fonts-normal flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    لا يمكن الرجوع للخطوة السابقة لضمان سلامة البيانات
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800 dark:border-t-gray-700"></div>
                </div>
              </div>

              {step !== 3 ? (
                <button
                  type="submit"
                  onClick={async () => {
                    if (step === 1) {
                      await handleCreateCourse();
                    } else if (step === 2) {
                      await fetchCourseAfterPublished();
                      nextStep();
                    } else {
                      nextStep();
                    }
                  }}
                  disabled={loadingCreatingCourse}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium apply-fonts-normal transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingCreatingCourse && (
                    <Loader className="animate-spin w-4 h-4" />
                  )}
                  {loadingCreatingCourse ? "جارٍ الإنشاء..." : "التالي"}
                </button>
              ) : (
                <div className="flex gap-4">
                  {/* Delete Course Button */}
                  <button
                    onClick={() =>
                      openDeleteModal(
                        "course",
                        "حذف الكورس",
                        "هل أنت متأكد من حذف هذا الكورس نهائياً؟ هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع الأقسام والفيديوهات والملفات المرتبطة به.",
                        deleteCourse
                      )
                    }
                    disabled={loadingDeleteCourse}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium apply-fonts-normal transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingDeleteCourse ? (
                      <>
                        <Loader className="animate-spin w-4 h-4" />
                        جارٍ الحذف...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        حذف الكورس
                      </>
                    )}
                  </button>

                  {/* Publish Button */}
                  <button
                    onClick={() => {
                      showToast("success", "تم نشر الكورس بنجاح!");
                      router.push(`/course/${currentCourse._id}`);
                      sessionStorage.removeItem("course_id");
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium apply-fonts-normal transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    🎉 معاينة الكورس
                  </button>
                </div>
              )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteModalConfig && (
              <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-inner max-w-md w-full mx-auto transform transition-all duration-300">
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold apply-fonts-normal">
                        {deleteModalConfig.title}
                      </h3>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 apply-fonts-normal leading-relaxed mb-6">
                      {deleteModalConfig.message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        disabled={
                          loadingDeleteVideo !== "" ||
                          loadingDeleteCourse ||
                          deleteSectionLoading ||
                          deleteFileLoading
                        }
                        className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium apply-fonts-normal hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={deleteModalConfig.onConfirm}
                        disabled={
                          loadingDeleteVideo !== "" ||
                          loadingDeleteCourse ||
                          deleteSectionLoading ||
                          deleteFileLoading
                        }
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white rounded-xl font-medium apply-fonts-normal hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loadingDeleteVideo !== "" ||
                        loadingDeleteCourse ||
                        deleteSectionLoading ||
                        deleteFileLoading ? (
                          <>
                            <Loader className="animate-spin w-4 h-4" />
                            جارٍ الحذف...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            تأكيد الحذف
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Step 1 ---------------- */
interface StepGeneralDetailsProps {
  courseDetails: CourseDetails;
  setCourseDetails: Dispatch<SetStateAction<CourseDetails>>;
  concepts: string[];
  newconcept: string;
  setNewConcept: Dispatch<SetStateAction<string>>;
  addConcept: (concept: string) => void;
  removeConcept: (index: number) => void;
}

function StepGeneralDetails({
  courseDetails,
  setCourseDetails,
  concepts,
  newconcept,
  setNewConcept,
  addConcept,
  removeConcept,
}: StepGeneralDetailsProps) {
  const [imageCoverPreview, setImageCoverPreview] = useState<string | null>(
    null
  );

  const handleImageCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageCoverPreview(URL.createObjectURL(file));
      setCourseDetails((prev) => ({ ...prev, imageCover: file }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Course Title & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
            عنوان الكورس
          </label>
          <input
            type="text"
            placeholder="أدخل عنوان الكورس"
            value={courseDetails?.title}
            onChange={handleInputChange}
            name="title"
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors apply-fonts-normal text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
            السعر (دينار جزائري)
          </label>
          <input
            type="number"
            placeholder="0"
            value={courseDetails?.price}
            onChange={handleInputChange}
            name="price"
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors text-lg"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
          وصف الكورس
        </label>
        <textarea
          placeholder="اكتب وصفاً تفصيلياً عن محتوى الكورس..."
          value={courseDetails?.description}
          onChange={handleInputChange}
          rows={6}
          name="description"
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors apply-fonts-normal text-lg resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
          الفئة
        </label>
        <select
          name="category"
          value={courseDetails?.category}
          onChange={handleInputChange}
          className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors apply-fonts-normal text-lg"
        >
          <option value="">اختر الفئة</option>
          <option value="رياضيات">رياضيات</option>
          <option value="فيزياء">فيزياء</option>
          <option value="كيمياء">كيمياء</option>
          <option value="برمجة">برمجة</option>
          <option value="لغات">لغات</option>
        </select>
      </div>

      {/* Image Cover */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
          صورة الغلاف
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
          <input
            type="file"
            id="imageCover"
            accept="image/*"
            onChange={handleImageCoverChange}
            className="hidden"
          />
          <label htmlFor="imageCover" className="cursor-pointer">
            {imageCoverPreview ? (
              <div className="space-y-4">
                <Image
                  src={imageCoverPreview}
                  alt="صورة الغلاف"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  width={400}
                  height={250}
                />
                <p className="text-indigo-600 dark:text-indigo-400 font-medium apply-fonts-normal">
                  انقر لتغيير الصورة
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 apply-fonts-normal">
                    انقر لرفع صورة الغلاف
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 apply-fonts-normal">
                    PNG, JPG أو GIF (الحد الأقصى 5MB)
                  </p>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Concepts */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 apply-fonts-normal">
          المفاهيم الرئيسية
        </label>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={newconcept}
            onChange={(e) => setNewConcept(e.target.value)}
            placeholder="أضف مفهوماً جديداً"
            className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors apply-fonts-normal"
            onKeyPress={(e) => {
              if (e.key === "Enter" && newconcept.trim()) {
                addConcept(newconcept);
                setNewConcept("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (newconcept.trim()) {
                addConcept(newconcept);
                setNewConcept("");
              }
            }}
            className="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium apply-fonts-normal"
          >
            أضف
          </button>
        </div>

        {concepts.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {concepts.map((concept: string, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-900 px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span className="apply-fonts-normal text-indigo-800 dark:text-indigo-300 font-medium">
                  {concept}
                </span>
                <button
                  type="button"
                  onClick={() => removeConcept(index)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 2: Sections and Videos Combined ---------------- */
interface StepSectionsAndVideosProps {
  sections: Section[];
  loadingAddSection: boolean;
  handleAddSctions: () => void;
  handleDeleteSction: (sectionId: string) => void;
  currentCourse: Course;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  addVideoToSection: (
    sectionId: string,
    title: string,
    file: File,
    duration: string,
    description: string
  ) => void;
  loadingAddVideoToSection: boolean;
  deleteSectionLoading: boolean;
  deleteVideo: (sectionId: string, videoId: string) => void;
  loadingDeleteVideo: string;
  addFileToVideo: (
    sectionId: string,
    videoId: string,
    fileName: string,
    file: File
  ) => void;
  deleteFileFromVideo: (
    sectionId: string,
    videoId: string,
    fileId: string
  ) => void;
  loadingUploadFile: string;
  openDeleteModal: (
    type: "video" | "file" | "course" | "section",
    title: string,
    message: string,
    onConfirm: () => void
  ) => void;
}

function StepSectionsAndVideos({
  sections,
  loadingAddSection,
  handleAddSctions,
  title,
  setTitle,
  addVideoToSection,
  loadingAddVideoToSection,
  deleteVideo,
  loadingDeleteVideo,
  addFileToVideo,
  deleteFileFromVideo,
  loadingUploadFile,
  openDeleteModal,
  handleDeleteSction,
  deleteSectionLoading,
}: StepSectionsAndVideosProps) {
  const [videosUpload, setVideosUpload] = useState<
    Record<string, VideoUpload[]>
  >({});
  const [fileUploads, setFileUploads] = useState<
    Record<string, { title: string; file: File | null }>
  >({});

  const handleVideoChange = (
    sectionId: string,
    videoIndex: number,
    field: "title" | "file" | "duration" | "description",
    value: string | File
  ) => {
    setVideosUpload((prev) => {
      const sectionVideos = prev[sectionId] || [];
      const updated = [...sectionVideos];
      updated[videoIndex] = { ...updated[videoIndex], [field]: value };
      return { ...prev, [sectionId]: updated };
    });
  };

  const addVideoField = (sectionId: string) => {
    setVideosUpload((prev) => {
      const sectionVideos = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: [
          ...sectionVideos,
          {
            title: "",
            file: null as File | null,
            duration: "",
            description: "",
          },
        ],
      };
    });
  };

  const removeVideoField = (sectionId: string, videoIndex: number) => {
    setVideosUpload((prev) => {
      const sectionVideos = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: sectionVideos.filter((_, i) => i !== videoIndex),
      };
    });
  };

  return (
    <div className="space-y-8">
      {/* Add Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-2xl border border-blue-200 dark:border-blue-900">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 apply-fonts-normal flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة قسم جديد
        </h2>
        <div className="flex gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان القسم"
            className="flex-1 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors apply-fonts-normal"
            onKeyPress={(e) => {
              if (e.key === "Enter" && title.trim()) {
                handleAddSctions();
              }
            }}
          />
          <button
            onClick={handleAddSctions}
            disabled={loadingAddSection}
            className="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium apply-fonts-normal disabled:opacity-50 flex items-center gap-2"
          >
            {loadingAddSection ? (
              <>
                <Loader className="animate-spin w-4 h-4" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                حفظ القسم
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div
            key={section._id}
            className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 apply-fonts-normal flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {sectionIndex + 1}
                  </div>
                  {section.title}
                </h3>
                <button
                  onClick={() =>
                    openDeleteModal(
                      "section",
                      "حذف القسم",
                      `هل أنت متأكد من حذف قسم "${section.title}"؟ سيتم حذف جميع الفيديوهات والملفات المرتبطة به نهائياً.`,
                      () => handleDeleteSction(section._id)
                    )
                  }
                  disabled={deleteSectionLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium apply-fonts-normal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteSectionLoading ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" />
                      جارٍ الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      حذف القسم
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Add Video to Section */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-900">
                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 apply-fonts-normal flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  إضافة فيديو جديد
                </h4>

                {(videosUpload[section._id] || []).map((video, videoIndex) => (
                  <div
                    key={videoIndex}
                    className="space-y-3 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700"
                  >
                    <input
                      type="text"
                      placeholder="عنوان الفيديو"
                      value={video.title}
                      onChange={(e) =>
                        handleVideoChange(
                          section._id,
                          videoIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:border-indigo-500 apply-fonts-normal"
                    />
                    <input
                      type="text"
                      placeholder="مدة الفيديو"
                      value={video.duration}
                      onChange={(e) =>
                        handleVideoChange(
                          section._id,
                          videoIndex,
                          "duration",
                          e.target.value
                        )
                      }
                      className="w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      placeholder="وصف الفيديو"
                      value={video.description}
                      onChange={(e) =>
                        handleVideoChange(
                          section._id,
                          videoIndex,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:border-indigo-500 apply-fonts-normal"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVideoChange(
                            section._id,
                            videoIndex,
                            "file",
                            e.target.files[0]
                          );
                        }
                      }}
                      className="w-full border-2 border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            video.file &&
                            video.title &&
                            video.description &&
                            video.duration
                          ) {
                            await addVideoToSection(
                              section._id,
                              video.title,
                              video.file,
                              video.duration,
                              video.description
                            );
                            removeVideoField(section._id, videoIndex);
                          }
                        }}
                        disabled={loadingAddVideoToSection}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium apply-fonts-normal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingAddVideoToSection ? (
                          <>
                            <Loader className="animate-spin w-4 h-4" />
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            رفع الفيديو
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeVideoField(section._id, videoIndex)
                        }
                        disabled={loadingAddVideoToSection}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium apply-fonts-normal flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addVideoField(section._id)}
                  className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium apply-fonts-normal flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة فيديو
                </button>
              </div>

              {/* Uploaded Videos */}
              {section.videos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200 apply-fonts-normal flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    الفيديوهات المرفوعة ({section.videos.length})
                  </h4>

                  {section.videos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-100 apply-fonts-normal text-lg">
                            {video.lessonTitle}
                          </h5>
                          <p className="text-gray-500 dark:text-gray-400 text-sm apply-fonts-normal">
                            مدة الفيديو: {video.duration} دقيقة
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            مشاهدة
                          </a>
                          <button
                            onClick={() =>
                              openDeleteModal(
                                "video",
                                "حذف الفيديو",
                                `هل أنت متأكد من حذف فيديو "${video.lessonTitle}"؟ سيتم حذف جميع الملفات المرتبطة به أيضاً.`,
                                () => deleteVideo(section._id, video._id)
                              )
                            }
                            disabled={loadingDeleteVideo === video._id}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingDeleteVideo === video._id ? (
                              <Loader className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            حذف
                          </button>
                        </div>
                      </div>

                      {/* Add Files to Video */}
                      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h6 className="font-medium text-gray-700 dark:text-gray-200 mb-3 apply-fonts-normal flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          إضافة ملف للدرس
                        </h6>

                        <div className="flex gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="اسم الملف"
                            value={fileUploads[video._id]?.title || ""}
                            onChange={(e) =>
                              setFileUploads((prev) => ({
                                ...prev,
                                [video._id]: {
                                  ...prev[video._id],
                                  title: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 rounded-lg focus:outline-none focus:border-indigo-500 apply-fonts-normal"
                          />
                          <input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFileUploads((prev) => ({
                                  ...prev,
                                  [video._id]: {
                                    ...prev[video._id],
                                    file: e.target.files![0],
                                  },
                                }));
                              }
                            }}
                            className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => {
                              const fileData = fileUploads[video._id];
                              if (fileData?.title && fileData?.file) {
                                addFileToVideo(
                                  section._id,
                                  video._id,
                                  fileData.title,
                                  fileData.file
                                );
                                setFileUploads((prev) => ({
                                  ...prev,
                                  [video._id]: { title: "", file: null },
                                }));
                              }
                            }}
                            disabled={loadingUploadFile === video._id}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium apply-fonts-normal flex items-center gap-1 disabled:opacity-50"
                          >
                            {loadingUploadFile === video._id ? (
                              <>
                                <Loader className="animate-spin w-3 h-3" />
                                رفع...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3" />
                                رفع
                              </>
                            )}
                          </button>
                        </div>

                        {/* Display Video Files */}
                        {video.files && video.files.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 apply-fonts-normal">
                              الملفات المرفوعة:
                            </p>
                            {video.files.map((file) => (
                              <div
                                key={file._id}
                                className="flex justify-between items-center bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 p-2 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-medium apply-fonts-normal text-gray-900 dark:text-gray-100">
                                    {file.filename}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    ({(file.size / 1024).toFixed(2)} KB)
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 dark:text-green-400 hover:text-green-700 text-xs underline"
                                  >
                                    تحميل
                                  </a>
                                  <button
                                    onClick={() =>
                                      openDeleteModal(
                                        "file",
                                        "حذف الملف",
                                        `هل أنت متأكد من حذف ملف "${file.filename}"؟`,
                                        () =>
                                          deleteFileFromVideo(
                                            section._id,
                                            video._id,
                                            file._id
                                          )
                                      )
                                    }
                                    className="text-red-500 dark:text-red-400 hover:text-red-700 text-xs"
                                  >
                                    ❌
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Video className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 apply-fonts-normal mb-2">
              لا توجد أقسام بعد
            </h3>
            <p className="text-gray-400 dark:text-gray-500 apply-fonts-normal">
              ابدأ بإضافة القسم الأول لتنظيم محتوى الكورس
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Step 3: Publish ---------------- */
interface StepPublishProps {
  currentCourse: Course;
}

function StepPublish({ currentCourse }: StepPublishProps) {
  const totalVideos =
    currentCourse.sections?.reduce(
      (acc, section) => acc + (section.videos?.length || 0),
      0
    ) || 0;
  const totalFiles =
    currentCourse.sections?.reduce(
      (acc, section) =>
        acc +
        (section.videos?.reduce(
          (videoAcc, video) => videoAcc + (video.files?.length || 0),
          0
        ) || 0),
      0
    ) || 0;

  return (
    <div className="space-y-8">
      {/* Course Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 apply-fonts-normal flex items-center gap-2">
          🎉 ملخص الكورس
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal">
                عنوان الكورس:
              </h3>
              <p className="text-lg text-gray-800 dark:text-gray-100 apply-fonts-normal">
                {currentCourse.title}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal">
                السعر:
              </h3>
              <p className="text-lg text-gray-800 dark:text-gray-100">
                {currentCourse.price} دينار جزائري
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal">
                الفئة:
              </h3>
              <p className="text-lg text-gray-800 dark:text-gray-100 apply-fonts-normal">
                {currentCourse.category}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal mb-2">
                إحصائيات المحتوى:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="apply-fonts-normal text-gray-600 dark:text-gray-400">
                    عدد الأقسام:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {currentCourse.sections?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="apply-fonts-normal text-gray-600 dark:text-gray-400">
                    عدد الفيديوهات:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {totalVideos}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="apply-fonts-normal text-gray-600 dark:text-gray-400">
                    عدد الملفات:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {totalFiles}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal mb-2">
                المفاهيم:
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentCourse.concepts?.map((concept, index) => (
                  <span
                    key={index}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium apply-fonts-normal"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 apply-fonts-normal mb-2">
            الوصف:
          </h3>
          <p className="text-gray-600 dark:text-gray-400 apply-fonts-normal leading-relaxed">
            {currentCourse.description}
          </p>
        </div>
      </div>

      {/* Course Sections Preview */}
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 apply-fonts-normal">
          معاينة الأقسام
        </h3>

        {currentCourse.sections && currentCourse.sections.length > 0 ? (
          <div className="space-y-4">
            {currentCourse.sections.map((section, index) => (
              <div
                key={section._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 apply-fonts-normal flex items-center gap-2">
                  <span className="w-6 h-6 bg-indigo-600 dark:bg-indigo-800 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {section.title}
                </h4>

                {section.videos && section.videos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {section.videos.map((video, videoIndex) => (
                      <div
                        key={video._id}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ml-8"
                      >
                        <Video className="w-4 h-4" />
                        <span className="apply-fonts-normal">
                          {videoIndex + 1}. {video.lessonTitle}
                        </span>
                        {video.files && video.files.length > 0 && (
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                            {video.files.length} ملف
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-500 apply-fonts-normal text-center py-8">
            لا توجد أقسام في الكورس
          </p>
        )}
      </div>

      {/* Success Message */}
      <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-8">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 apply-fonts-normal">
          الكورس جاهز للنشر!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 apply-fonts-normal mb-6">
          تم إنشاء الكورس بنجاح مع جميع الأقسام والفيديوهات والملفات المرفقة
        </p>
        <div className="flex justify-center gap-4">
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {currentCourse.sections?.length || 0}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 apply-fonts-normal">
              قسم
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalVideos}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 apply-fonts-normal">
              فيديو
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalFiles}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 apply-fonts-normal">
              ملف
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
