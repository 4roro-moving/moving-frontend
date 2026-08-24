import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MyContentDetail, MyContentType } from "@/types/myContent";

export async function getMyContentDetail(
  contentType: MyContentType,
  contentId: number,
): Promise<MyContentDetail> {
  return fetchInstance.get<MyContentDetail>(API_ROUTES.MY_CONTENTS.DETAIL(contentType, contentId));
}
