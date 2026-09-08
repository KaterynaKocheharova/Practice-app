import { X } from "lucide-react";
import Link from "next/link";
import { AuthActions } from "../auth-actions/auth-actions";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { cn } from "@/modules/common/utils";
import { Button } from "../../button/button";
import { SidebarLink } from "../sidebar-link";
import { sidebarStyles } from "./style";
import type { SidebarProps } from "./types";

export const Sidebar = ({
  displayName,
  isAuthenticated,
  isLoading,
  isLogoutPending,
  isOpen,
  onClose,
  onLogout,
  sidebarId,
}: SidebarProps) => (
  <>
    <div
      aria-hidden={!isOpen}
      className={cn(
        sidebarStyles.overlay.root,
        isOpen ? sidebarStyles.overlay.open : sidebarStyles.overlay.closed,
      )}
      onClick={onClose}
    />
    <aside
      aria-label={TEXTS.NAVIGATION.SIDEBAR_NAVIGATION}
      className={cn(
        sidebarStyles.root,
        isOpen ? sidebarStyles.open : sidebarStyles.closed,
      )}
      id={sidebarId}
    >
      <div className={sidebarStyles.header}>
        <Link
          className={sidebarStyles.brand}
          href={APP_ROUTES.HOME}
          onClick={onClose}
        >
          {TEXTS.APP_NAME}
        </Link>
        <Button
          aria-label={TEXTS.NAVIGATION.CLOSE}
          className={sidebarStyles.closeButton}
          onClick={onClose}
          variant="ghost"
        >
          <X aria-hidden="true" className={sidebarStyles.closeIcon} />
        </Button>
      </div>

      <nav
        aria-label={TEXTS.NAVIGATION.SIDEBAR}
        className={sidebarStyles.nav}
      >
        <SidebarLink href={APP_ROUTES.HOME} onClick={onClose}>
          {TEXTS.NAVIGATION.HOME}
        </SidebarLink>
      </nav>

      <div className={sidebarStyles.actions}>
        <AuthActions
          displayName={displayName}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          isLogoutPending={isLogoutPending}
          onLogout={onLogout}
          stacked
        />
      </div>
    </aside>
  </>
);
