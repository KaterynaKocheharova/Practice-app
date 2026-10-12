import type { StudentCard } from "../types";


export const appendNewStudents = (
  loadedStudents: StudentCard[],
  nextStudents: StudentCard[],
): StudentCard[] => {
  const loadedIds = new Set(loadedStudents.map(({ id }) => id));

  return [
    ...loadedStudents,
    ...nextStudents.filter(({ id }) => !loadedIds.has(id)),
  ];
};
