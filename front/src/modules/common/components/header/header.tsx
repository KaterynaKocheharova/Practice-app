"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useLogout } from "@/modules/auth/hooks";
import { APP_ROUTES } from "@/modules/common/constants";
import { Container } from "../container/container";
import { getPrimaryNavLinks } from "./get-primary-nav-links";
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
  const [isLogoutRefreshPending, startLogoutRefreshTransition] =
    useTransition();

  const isAuthenticated = initialUser !== null;
  const isAuthStateLoading = isLogoutPending || isLogoutRefreshPending;
  const shouldShowAuthenticatedState = isAuthenticated && !isAuthStateLoading;

  const displayName = initialUser?.name || initialUser?.email;
  const navLinks = getPrimaryNavLinks(
    shouldShowAuthenticatedState ? initialUser?.role : undefined,
  );

  const handleLogout = () => {
    closeSidebar();
    logout({
      onSettled: () => {
        startLogoutRefreshTransition(() => {
          router.replace(APP_ROUTES.SIGN_IN);
          router.refresh();
        });
      },
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
          onLogout={handleLogout}
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
        onLogout={handleLogout}
        sidebarId={sidebarId}
      />
    </header>
  );
};
