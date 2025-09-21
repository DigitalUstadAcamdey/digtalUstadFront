// import { User } from "@/types/user";
import axios from "axios";
import { create } from "zustand";
import { User } from "@/types/user";
export const useUserStore = create<{
  user: User;
  fetchUser: () => Promise<void>;
  loading: boolean;
  setLoading: (newvalue: boolean) => void;
  setUser: (newUser: User) => void;
}>((set) => ({
  user: {
    _id: "",
    username: "",
    email: "",
    role: null,
    active: false,
    progress: [],
    thumbnail: "",
    enrolledCourses: [],
    phoneNumber: "",
    publishedCourses: [],
    notifications: [],
  },
  loading: false,
  setLoading: (newValue: boolean) => {
    set(() => ({ loading: newValue }));
  },
  fetchUser: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/users/me`,
        {
          withCredentials: true,

          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ user: res.data.user });
    } catch (error) {
      console.log("Error when Fetching user in userStore", error);
      set({
        user: {
          _id: "",
          username: "",
          email: "",
          role: null,
          active: false,
          progress: [],
          thumbnail: "",
          enrolledCourses: [],
          phoneNumber: "",
          publishedCourses: [],
          notifications: [],
        },
      });
    } finally {
      set({ loading: false });
    }
  },
  setUser: (newUser: User) => {
    set(() => ({ user: newUser }));
  },
}));
