import type { ServerApiFailure } from "@/modules/common/api";

export interface StudentResourceErrorProps
  extends Pick<ServerApiFailure, "status"> {
  loadFailedMessage: string;
  notFoundMessage: string;
}
