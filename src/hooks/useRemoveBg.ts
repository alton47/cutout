"use client";

import { useState, useCallback } from "react";
import type { Payload, ResultData, ErrorData, AppState } from "@/types";
import { validateImageFile, stripExtension, sleep } from "@/lib/utils";

interface RemoveBgState {
  appState: AppState;
  result: ResultData | null;
  error: ErrorData | null;
  loaderThumb: string;
  lastPayload: Payload | null;
}

export function useRemoveBg() {
  const [state, setState] = useState<RemoveBgState>({
    appState: "upload",
    result: null,
    error: null,
    loaderThumb: "",
    lastPayload: null,
  });

  const processFile = useCallback((file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setState((s) => ({
        ...s,
        appState: "error",
        error: { title: "Invalid file", message: validationError },
      }));
      return;
    }

    const thumbUrl = URL.createObjectURL(file);
    const payload: Payload = { type: "file", file };

    setState((s) => ({
      ...s,
      appState: "loading",
      loaderThumb: thumbUrl,
      lastPayload: payload,
      error: null,
    }));

    runRemoval(payload, stripExtension(file.name));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const processUrl = useCallback((url: string) => {
    const payload: Payload = { type: "url", url };

    setState((s) => ({
      ...s,
      appState: "loading",
      loaderThumb: url,
      lastPayload: payload,
      error: null,
    }));

    runRemoval(payload, "image");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = useCallback(() => {
    setState((s) => {
      if (!s.lastPayload) return { ...s, appState: "upload" };

      const thumbUrl =
        s.lastPayload.type === "file"
          ? URL.createObjectURL(s.lastPayload.file)
          : s.lastPayload.url;

      const origName =
        s.lastPayload.type === "file"
          ? stripExtension(s.lastPayload.file.name)
          : "image";

      // Fire async outside setState
      setTimeout(() => runRemoval(s.lastPayload!, origName), 0);

      return { ...s, appState: "loading", loaderThumb: thumbUrl, error: null };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setState({
      appState: "upload",
      result: null,
      error: null,
      loaderThumb: "",
      lastPayload: null,
    });
  }, []);

  async function runRemoval(
    payload: Payload,
    originalFileName: string,
    retries = 2,
  ) {
    try {
      const formData = new FormData();

      if (payload.type === "file") {
        formData.append("image_file", payload.file);
      } else {
        formData.append("image_url", payload.url);
      }

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      // Rate limit
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") ?? "10", 10);
        if (retries > 0) {
          await sleep(retryAfter * 1000);
          return runRemoval(payload, originalFileName, retries - 1);
        }
        setError(
          "Rate limit hit",
          `Too many requests. Wait ${retryAfter}s and try again.`,
        );
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          (data as { error?: string }).error ??
          `Processing failed (HTTP ${res.status})`;
        setError("Processing failed", msg);
        return;
      }

      const blob = await res.blob();
      const width = res.headers.get("X-Width") ?? "";
      const height = res.headers.get("X-Height") ?? "";
      const originalSrc =
        payload.type === "file"
          ? URL.createObjectURL(payload.file)
          : payload.url;

      const resultData: ResultData = {
        blob,
        objectUrl: URL.createObjectURL(blob),
        originalSrc,
        width,
        height,
        originalFileName,
      };

      setState((s) => ({ ...s, appState: "result", result: resultData }));
    } catch {
      if (retries > 0) {
        await sleep(1200);
        return runRemoval(payload, originalFileName, retries - 1);
      }
      setError("Network error", "Check your connection and try again.");
    }
  }

  function setError(title: string, message: string) {
    setState((s) => ({
      ...s,
      appState: "error",
      error: { title, message },
    }));
  }

  return {
    ...state,
    processFile,
    processUrl,
    retry,
    reset,
  };
}
