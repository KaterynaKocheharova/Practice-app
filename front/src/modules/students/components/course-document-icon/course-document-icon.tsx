import { FileAudio, FileImage, FileText, Link } from "lucide-react";
import { MediaAssetKind } from "../../students.enums";
import { courseDocumentIconStyles } from "./style";
import type { CourseDocumentIconProps } from "./types";

const FILE_KIND_ICONS = {
  [MediaAssetKind.Audio]: FileAudio,
  [MediaAssetKind.Document]: FileText,
  [MediaAssetKind.Image]: FileImage,
} satisfies Record<MediaAssetKind, typeof FileText>;

export const CourseDocumentIcon = ({ file }: CourseDocumentIconProps) => {
  const Icon = file ? FILE_KIND_ICONS[file.kind] : Link;

  return <Icon aria-hidden className={courseDocumentIconStyles.root} />;
};
