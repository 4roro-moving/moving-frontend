import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";

// 2026.07.27 정슬기 - [추가] /reviews → 작성 가능 리뷰로 이동
export default function ReviewsIndexPage() {
  redirect(APP_ROUTES.REVIEWS.WRITABLE);
}
