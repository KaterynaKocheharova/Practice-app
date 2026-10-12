"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/modules/auth/actions/auth-actions";
import { APP_ROUTES } from "@/modules/common/constants";
import { useServerAction } from "../../hooks";
import { Container } from "../container/container";
import { getPrimaryNavLinks } from "../../utils";
import { HeaderDesktopNav } from "./header-desktop-nav/header-desktop-nav";
import { HeaderStart } from "./header-start/header-start";
import { useSidebar } from "./hooks/use-sidebar";
import { Sidebar } from "./sidebar/sidebar";
import { headerStyles } from "./style";
import type { HeaderProps } from "./types";

export const Header = ({ currentUser }: HeaderProps) => {
  const router = useRouter();
  const { closeSidebar, isSidebarOpen, openSidebar, sidebarId } = useSidebar();
  const { isPending: isLogoutPending, run: logout } = useServerAction(logoutAction);
  const [isLogoutRefreshPending, startLogoutRefreshTransition] =
    useTransition();

  const isAuthenticated = currentUser !== null;
  const isAuthStateLoading = isLogoutPending || isLogoutRefreshPending;
  const shouldShowAuthenticatedState = isAuthenticated && !isAuthStateLoading;

  const displayName = currentUser?.name || currentUser?.email;
  const navLinks = getPrimaryNavLinks(
    shouldShowAuthenticatedState ? currentUser?.role : undefined,
  );

  const handleLogout = async () => {
    closeSidebar();
    await logout();
    startLogoutRefreshTransition(() => {
      router.replace(APP_ROUTES.SIGN_IN);
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
          isLoading={isAuthStateLoading}
          isLogoutPending={isLogoutPending}
          navLinks={navLinks}
          onLogout={() => void handleLogout()}
        />
      </Container>

      <Sidebar
        displayName={displayName}
        isAuthenticated={shouldShowAuthenticatedState}
        isLoading={isAuthStateLoading}
        isLogoutPending={isLogoutPending}
        isOpen={isSidebarOpen}
        navLinks={navLinks}
        onClose={closeSidebar}
        onLogout={() => void handleLogout()}
        sidebarId={sidebarId}
      />
    </header>
  );
};
