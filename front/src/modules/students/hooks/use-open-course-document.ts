"use client";

import { useServerAction } from "@/modules/common/hooks";
import { getCourseDocumentDownloadUrlAction } from "../actions/course-documents-actions";
import type { GetCourseDocumentRequest } from "../types";

const BLANK_PAGE = "about:blank";
const NEW_TAB = "_blank";

/**
 * Opens a file document in a new tab. The tab is opened synchronously inside
 * the click (popup blockers allow it only then), and the short-lived URL is
 * loaded into it once it arrives. Storage serves it `inline`, so the browser
 * shows PDFs, images, audio and text and downloads other types. Resolves to
 * whether the document opened.
 */
export const useOpenCourseDocument = (document: GetCourseDocumentRequest) => {
  const { isPending, run: getDownloadUrl } = useServerAction(
    getCourseDocumentDownloadUrlAction,
  );

  const open = async (): Promise<boolean> => {
    const tab = window.open(BLANK_PAGE, NEW_TAB);

    if (!tab) {
      return false;
    }

    // The opened page must not control the app tab.
    tab.opener = null;

    const result = await getDownloadUrl(document);

    if (!result.ok) {
      tab.close();
      return false;
    }

    tab.location.href = result.data.url;

    return true;
  };

  return { isPending, open };
};
