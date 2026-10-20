import { TEACHERS_CONFIG } from "../teachers.config";

const { locale, options } = TEACHERS_CONFIG.dateFormat;
const goalDateFormat = new Intl.DateTimeFormat(locale, options);

export const formatGoalDate = (isoDate: string): string =>
  goalDateFormat.format(new Date(isoDate));
