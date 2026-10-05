import { TEXTS } from "@/modules/common/constants";
import { studentHobbiesStyles } from "./style";
import type { StudentHobbiesProps } from "./types";

export const StudentHobbies = ({ hobbies }: StudentHobbiesProps) => (
  <ul aria-label={TEXTS.STUDENTS.HOBBIES_LABEL} className={studentHobbiesStyles.root}>
    {hobbies.map((hobby, index) => (
      <li className={studentHobbiesStyles.item} key={`${hobby}-${index}`}>
        {hobby}
      </li>
    ))}
  </ul>
);
