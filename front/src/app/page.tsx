import { redirect } from "next/navigation";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { getCurrentUserServer } from "@/modules/auth/api/current-user-server";
import { APP_ROUTES } from "@/modules/common/constants";

const RootPage = async () => {
  const currentUser = await getCurrentUserServer();

  redirect(
    currentUser
      ? AUTH_CONFIG.roleHomeRoutes[currentUser.role]
      : APP_ROUTES.SIGN_IN,
  );
};

export default RootPage;
