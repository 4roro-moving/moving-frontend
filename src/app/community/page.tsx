import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";

const CommunityIndexPage = () => {
  redirect(APP_ROUTES.COMMUNITY.RESIDENCE_REVIEWS);
};

export default CommunityIndexPage;
