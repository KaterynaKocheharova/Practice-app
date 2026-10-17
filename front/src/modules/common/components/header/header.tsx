"use client";

import { logoutAction } from "@/modules/auth/actions/auth-actions";
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
  const { closeSidebar, isSidebarOpen, openSidebar, sidebarId } = useSidebar();
  const { isPending: isLogoutPending, run: logout } = useServerAction(logoutAction);

  const isAuthenticated = currentUser !== null;
  const displayName = currentUser?.name || currentUser?.email;
  const navLinks = getPrimaryNavLinks(currentUser?.role ?? undefined);

  const handleLogout = () => {
    closeSidebar();
    void logout();
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
          isAuthenticated={isAuthenticated}
          isLogoutPending={isLogoutPending}
          navLinks={navLinks}
          onLogout={handleLogout}
        />
      </Container>

      <Sidebar
        displayName={displayName}
        isAuthenticated={isAuthenticated}
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
