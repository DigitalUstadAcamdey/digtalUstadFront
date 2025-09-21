"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";
// import showToast from "@/utils/showToast";

const GoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/me`,
        {
          withCredentials: true,
        }
      );

      setUserData(response.data.user);
    } catch (error) {
      // console.error("Error fetching user data:", error);
      if (
        // @ts-expect-error: fix after time
        error.response.data.message ===
        "الحساب غير مفعل حاليا، الرجاء التواصل مع الدعم لتفعيله"
      ) {
        router.push("/?inactive=true");
        return;
      }
      router.push("/signup");
    } finally {
      setLoading(false);
    }
  }, [setUserData, router, setLoading]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
      router.push("/signup");
    }
  }, [searchParams, router, fetchUserData]);

  useEffect(() => {
    if (!loading && userData) {
      if (userData.role === "student") {
        router.push("/dashboard-user");
      } else if (userData.role === "admin") {
        router.push("/dashboard-admin");
      } else {
        router.push("/signup");
      }
    }
  }, [loading, userData, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p>جاري التوجيه...</p>
    </div>
  );
};

export default GoogleCallback;
