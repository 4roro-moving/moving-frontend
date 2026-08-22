import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { FaqItem } from "@/types/faq";

export const fetchFaqs = () =>
  fetchInstance.get<FaqItem[]>(API_ROUTES.FAQS.ROOT, {
    skipAuth: true,
  });
