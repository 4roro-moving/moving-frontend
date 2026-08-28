import type { ReactNode } from "react";
import { cookies } from "next/headers";

import CommunityShell from "@/components/community/CommunityShell";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { ROLE_STORAGE_KEY, parseSoftUxAuthRole } from "@/lib/auth/role";

const CommunityLayout = async ({ children }: { children: ReactNode }) => {
  const cookieStore = await cookies();
  const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
  const initialRole = parseSoftUxAuthRole(rawRole ? safeDecodeCookieValue(rawRole) : null);

  return <CommunityShell initialRole={initialRole}>{children}</CommunityShell>;
};

export default CommunityLayout;
