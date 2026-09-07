import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/modules/auth/api/current-user-server";
import { APP_ROUTES } from "@/modules/common/constants";

const RootPage = async () => {
  const currentUser = await getCurrentUserServer();

  redirect(currentUser ? APP_ROUTES.HOME : APP_ROUTES.SIGN_IN);
};

export default RootPage;
