import { redirect } from "next/navigation";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { getCurrentUserServer } from "@/modules/auth/api/current-user-server";
import { APP_ROUTES } from "@/modules/common/constants";

const RootPage = async () => {
  const currentUser = await getCurrentUserServer();

  if (!currentUser) {
    redirect(APP_ROUTES.SIGN_IN);
  }

  redirect(
    currentUser.role
      ? AUTH_CONFIG.roleHomeRoutes[currentUser.role]
      : APP_ROUTES.ONBOARDING,
  );
};

export default RootPage;
