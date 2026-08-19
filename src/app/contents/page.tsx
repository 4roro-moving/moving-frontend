import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/lib/constants/appRoutes";

const ContentsIndexPage = () => {
  redirect(APP_ROUTES.CONTENTS.RESIDENCE_REVIEWS);
};

export default ContentsIndexPage;
