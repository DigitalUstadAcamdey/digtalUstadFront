import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Course } from "./types/course";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  // لو مافي حتى توكن → رجّع المستخدم للـ login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // نعمل طلب للـ API الخارجي /users/me
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/me`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`, // إرسال الـ token مباشرة
          "User-Agent": "NextJS-Middleware", // تمييز الطلبات
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Auth failed:", res.status, await res.text());
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const data = await res.json();
    const user = data.user;
    // التحقق من وجود المستخدم
    if (!user?.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const path = req.nextUrl.pathname;
    // التحقق من الدور
    if (path.startsWith("/dashboard-teacher") && user.role !== "teacher") {
      return NextResponse.redirect(
        new URL(
          `/dashboard-${user.role === "student" ? "user" : user.role}`,
          req.url
        )
      );
    }

    if (path.startsWith("/dashboard-admin") && user.role !== "admin") {
      return NextResponse.redirect(
        new URL(
          `/dashboard-${user.role === "student" ? "user" : user.role}`,
          req.url
        )
      );
    }

    if (path.startsWith("/dashboard-user") && user.role !== "student") {
      return NextResponse.redirect(
        new URL(
          `/dashboard-${user.role === "student" ? "user" : user.role}`,
          req.url
        )
      );
    }
    // protected /edit-course and /add-course (only for teachers)

    if (
      (path.startsWith("/edit-course") && user.role !== "teacher") ||
      (path.startsWith("/add-course") && user.role !== "teacher")
    ) {
      return NextResponse.redirect(
        new URL(
          `/dashboard-${user.role === "student" ? "user" : user.role}`,
          req.url
        )
      );
    }
    // protected /course/courseId
    const parts = pathname.split("/");
    const courseId = parts[2];

    if (pathname.startsWith("/course/")) {
      
      if (user.role === "student") {
        const isEnrolled = user.enrolledCourses.some(
          (c: Course) => c._id === courseId
        );
        console.log(!isEnrolled , 'is Enrolled')
        if (!isEnrolled) {
          return NextResponse.redirect(new URL(`/course-overview/${courseId}`, req.url));
        }
      } else if (user.role === "teacher") {
        const isPublished = user.publishedCourses.some(
          (c: Course) => c._id === courseId
        );
        if (!isPublished) {
          return NextResponse.redirect(new URL(`/course-overview/${courseId}`, req.url));
        }
      } else if (user.role === "admin") {
        // يدخل بدون قيد
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(`/`, req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// وين يتطبق الميدلواير
export const config = {
  matcher: [
    "/dashboard-teacher/:path*", // يحمي صفحات الـ teacher dashboard
    "/dashboard-user/:path*", // يحمي صفحات الـ student dashboard
    "/dashboard-admin/:path*", // يحمي صفحات الـ admin dashboard
    "/add-course", // يحمي صفحات الـ add-course
    "/edit-course/:path*", // يحمي صفحات الـ edit-course
    "/course/:path*", // يحمي صفحات الـ /course/:courseId
  ],
};
