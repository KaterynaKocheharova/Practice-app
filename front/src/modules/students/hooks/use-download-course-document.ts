"use client";

import { useMutation } from "@tanstack/react-query";
import { getCourseDocumentDownloadUrl } from "../api";
import type { GetCourseDocumentRequest } from "../types";

/**
 * Fetches a short-lived download URL and follows it. Storage answers with
 * `Content-Disposition: attachment`, so the page stays where it is.
 */
export const useDownloadCourseDocument = (document: GetCourseDocumentRequest) =>
  useMutation({
    mutationFn: async () => {
      const { url } = await getCourseDocumentDownloadUrl(document);
      window.location.assign(url);
    },
  });
