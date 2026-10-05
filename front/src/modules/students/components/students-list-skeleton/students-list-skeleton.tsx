import { Loader } from "@/modules/common/components";
import { studentsListSkeletonStyles } from "./style";
import type { StudentsListSkeletonProps } from "./types";

export const StudentsListSkeleton = ({ count }: StudentsListSkeletonProps) => (
  <div aria-busy="true" className={studentsListSkeletonStyles.root}>
    {Array.from({ length: count }, (_, index) => (
      <Loader className={studentsListSkeletonStyles.item} key={index} />
    ))}
  </div>
);
