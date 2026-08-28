import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";

// 2026.07.24 정슬기 - [추가] /estimates 진입 시 받았던 견적 목록으로 이동
export default function EstimatesIndexPage() {
  redirect(APP_ROUTES.ESTIMATES.RECEIVED);
}
