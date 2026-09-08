import { Menu } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { Button } from "../../button/button";
import { headerStartStyles } from "./style";
import type { HeaderStartProps } from "./types";

export const HeaderStart = ({
  isSidebarOpen,
  onOpenSidebar,
  sidebarId,
}: HeaderStartProps) => (
  <div className={headerStartStyles.root}>
    <Button
      aria-controls={sidebarId}
      aria-expanded={isSidebarOpen}
      aria-label={TEXTS.NAVIGATION.OPEN}
      className={headerStartStyles.menuButton}
      onClick={onOpenSidebar}
      variant="ghost"
    >
      <Menu aria-hidden="true" className={headerStartStyles.menuIcon} />
    </Button>
    <Link className={headerStartStyles.brand} href={APP_ROUTES.HOME}>
      {TEXTS.APP_NAME}
    </Link>
  </div>
);
