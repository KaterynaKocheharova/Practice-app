import type { TeacherGoalsPage } from "../types";

/** Changes after a create or delete, so the client list drops pages loaded before it. */
export const getGoalsPageKey = ({ items, total }: TeacherGoalsPage): string =>
  `${total}:${items.map(({ id }) => id).join(",")}`;
