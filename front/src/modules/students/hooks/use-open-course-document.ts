"use client";

import { useMutation } from "@tanstack/react-query";
import { ERRORS } from "@/modules/common/constants";
import { getCourseDocumentDownloadUrl } from "../api";
import type { GetCourseDocumentRequest } from "../types";

const BLANK_PAGE = "about:blank";
const NEW_TAB = "_blank";

/**
 * Opens a file document in a new tab. The tab is opened synchronously inside
 * the click (popup blockers allow it only then), and the short-lived URL is
 * loaded into it once it arrives. Storage serves it `inline`, so the browser
 * shows PDFs, images, audio and text and downloads other types.
 */
export const useOpenCourseDocument = (document: GetCourseDocumentRequest) => {
  const { mutateAsync: getUrl, isPending } = useMutation({
    mutationFn: () => getCourseDocumentDownloadUrl(document),
  });

  const open = async (): Promise<void> => {
    const tab = window.open(BLANK_PAGE, NEW_TAB);

    if (!tab) {
      throw new Error(ERRORS.COURSE_DOCUMENTS.OPEN_FAILED);
    }

    // The opened page must not control the app tab.
    tab.opener = null;

    try {
      const { url } = await getUrl();
      tab.location.href = url;
    } catch (error) {
      tab.close();
      throw error;
    }
  };

  return { isPending, open };
};
