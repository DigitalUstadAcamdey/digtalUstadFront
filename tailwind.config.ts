import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mainColor: "#3D45EE",
        mainColorHoverLight: "#2E36C0",
        mainColorHoverDark: "#5C66FF",
        secondColor: "#B9BCFF",
        starColor: "#FDF0CD",
        starIconColor: "#FFC700",
        startTextColor: "#FFB802",
        wygColor: "#F3F3F3",
        sideBarBgColo: "#1B1B1B",
        redColor: "#EE3D45",
        redColorHoverLight: "#FF5F68",
        succsseColor: "#45DA10",
        courseIconsSection: "#FF6636",
        courseTextSection: "#6E7485",
        courseStarColor: "#FD8E1F",
        courseConseptColor: "#E1F7E366",
        progressBarCourseColor: "#0DC7B1",
        // dark
        bodyDark: "#05061b", // خلفية رئيسية
        primaryDark: "#3E4FED", // اللون الأساسي في الداكن
        primaryHoverDark: "#2E36C0", // Hover للـ primary (داكن)
        secondaryDark: "#A5A8F0", // لون ثانوي أفتح للداكن
        textPrimary: "#FFFFFF", // النصوص الأساسية
        textSecondary: "#B0B3C7", // النصوص الثانوية
        starBgDark: "#1F1F2E", // خلفية النجوم في الداكن
        starIconDark: "#FFC700", // أيقونات النجوم
        starTextDark: "#FFD966", // نص النجوم/التقييم
        sidebarBgDark: "#0F1028", // خلفية الـ Sidebar
        cardBgDark: "#12132E", // خلفية الكاردات
        inputBgDark: "#1B1C3B", // خلفية الـ Inputs
        errorDark: "#FF5F68", // لون الخطأ في الداكن
        successDark: "#45DA10", // النجاح في الداكن
        courseIconDark: "#FF6636", // أيقونة الكورس (ثابتة)
        courseTextDark: "#D1D5E0", // نصوص الكورس في الداكن
        courseStarDark: "#FD8E1F", // نجوم الكورس
        progressBarDark: "#0DC7B1", // شريط التقدم
      },
      screens: {
        xs: "330px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
export default config;
