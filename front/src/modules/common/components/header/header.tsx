"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/modules/auth/hooks";
import { APP_ROUTES } from "@/modules/common/constants";
import { Container } from "../container";
import { HeaderDesktopNav } from "./header-desktop-nav/header-desktop-nav";
import { HeaderStart } from "./header-start/header-start";
import { useSidebar } from "./hooks/use-sidebar";
import { Sidebar } from "./sidebar/sidebar";
import { headerStyles } from "./style";
import type { HeaderProps } from "./types";

export const Header = ({ initialUser }: HeaderProps) => {
  const router = useRouter();
  const { closeSidebar, isSidebarOpen, openSidebar, sidebarId } = useSidebar();
  const { isPending: isLogoutPending, logout } = useLogout();
  const displayName = initialUser?.name || initialUser?.email;
  const isAuthenticated = initialUser !== null;
  const shouldShowAuthenticatedState = isAuthenticated && !isLogoutPending;

  const handleLogout = () => {
    closeSidebar();
    logout({
      onSettled: () => router.replace(APP_ROUTES.SIGN_IN),
    });
  };

  return (
    <header className={headerStyles.root}>
      <Container className={headerStyles.container}>
        <HeaderStart
          isSidebarOpen={isSidebarOpen}
          onOpenSidebar={openSidebar}
          sidebarId={sidebarId}
        />

        <HeaderDesktopNav
          displayName={displayName}
          isAuthenticated={shouldShowAuthenticatedState}
          isLogoutPending={isLogoutPending}
          onLogout={handleLogout}
        />
      </Container>

      <Sidebar
        displayName={displayName}
        isAuthenticated={shouldShowAuthenticatedState}
        isLoading={false}
        isLogoutPending={isLogoutPending}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onLogout={handleLogout}
        sidebarId={sidebarId}
      />
    </header>
  );
};
