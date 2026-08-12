import type { ReactNode } from "react";
import { cookies } from "next/headers";

import BlockMoverFromMoversBrowse from "@/components/auth/BlockMoverFromMoversBrowse";
import { LoginRequiredModalProvider } from "@/components/auth/LoginRequiredModalProvider";
import { safeDecodeCookieValue } from "@/lib/auth/clientStorageHint";
import { ROLE_STORAGE_KEY, parseSoftUxAuthRole } from "@/lib/auth/role";

interface MoversLayoutProps {
  children: ReactNode;
}

const MoversLayout = async ({ children }: MoversLayoutProps) => {
  const cookieStore = await cookies();
  const rawRole = cookieStore.get(ROLE_STORAGE_KEY)?.value;
  const decodedRole = rawRole ? safeDecodeCookieValue(rawRole) : null;
  const initialRole = parseSoftUxAuthRole(decodedRole);

  return (
    <LoginRequiredModalProvider>
      <BlockMoverFromMoversBrowse initialRole={initialRole}>{children}</BlockMoverFromMoversBrowse>
    </LoginRequiredModalProvider>
  );
};

export default MoversLayout;
