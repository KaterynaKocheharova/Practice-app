const BYTES_IN_KILOBYTE = 1024;
const SIZE_UNITS = ["B", "KB", "MB", "GB"];

/** e.g. `2.4 MB`; whole numbers for bytes. */
export const formatFileSize = (sizeBytes: number): string => {
  let size = sizeBytes;
  let unitIndex = 0;

  while (size >= BYTES_IN_KILOBYTE && unitIndex < SIZE_UNITS.length - 1) {
    size = BYTES_IN_KILOBYTE;
    unitIndex += 1;
  }

  const formattedSize = unitIndex === 0 ? size.toString() : size.toFixed(1);

  return `${formattedSize} ${SIZE_UNITS[unitIndex]}`;
};
