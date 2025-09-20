import { create } from "zustand";
import { Faq } from "@/types/faq";

export const useFaq = create<{
  faqs: Faq[];
  setFaqs: (updater: Faq[] | ((prevFaqs: Faq[]) => Faq[])) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>((set) => ({
  faqs: [],
  loading: false,
  setFaqs: (newFaqs) => {
    if (typeof newFaqs === "function") {
      set((state) => ({ faqs: newFaqs(state.faqs) }));
    } else {
      // وإلا، نستخدم القيمة مباشرة
      set({ faqs: newFaqs });
    }
  },
  setLoading: (newloading: boolean) => {
    set(() => ({ loading: newloading }));
  },
}));
