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

  const setError = useCallback((title: string, message: string) => {
    setState((s) => ({ ...s, appState: "error", error: { title, message } }));
  }, []);

  // 1. Fixed the "access before declaration" and added useCallback for stability
  const runRemoval = useCallback(
    async (payload: Payload, originalFileName: string, retries = 2) => {
      try {
        const formData = new FormData();

        // 2. Fixed the "unused expression" warning with proper if/else
        if (payload.type === "file") {
          formData.append("image_file", payload.file);
        } else {
          formData.append("image_url", payload.url);
        }

        const res = await fetch("/api/remove-bg", {
          method: "POST",
          body: formData,
        });

        if (res.status === 429) {
          const retryAfter = parseInt(
            res.headers.get("Retry-After") ?? "10",
            10,
          );
          if (retries > 0) {
            await sleep(retryAfter * 1000);
            return runRemoval(payload, originalFileName, retries - 1);
          }
          setError("Rate limit hit", "Too many requests.");
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError("Processing failed", data.error ?? `HTTP ${res.status}`);
          return;
        }

        const blob = await res.blob();
        const originalSrc =
          payload.type === "file"
            ? URL.createObjectURL(payload.file)
            : payload.url;

        setState((s) => ({
          ...s,
          appState: "result",
          result: {
            blob,
            objectUrl: URL.createObjectURL(blob),
            originalSrc,
            width: res.headers.get("X-Width") ?? "",
            height: res.headers.get("X-Height") ?? "",
            originalFileName,
          },
        }));
      } catch (err) {
        console.error("Removal error:", err);
        if (retries > 0) {
          await sleep(1200);
          return runRemoval(payload, originalFileName, retries - 1);
        }
        setError("Network error", "Check your connection.");
      }
    },
    [setError],
  ); // Stable dependency

  const processFile = useCallback(
    (file: File) => {
      const err = validateImageFile(file);
      if (err) return setError("Invalid file", err);

      const thumbUrl = URL.createObjectURL(file);
      const payload: Payload = { type: "file", file };

      setState((s) => ({
        ...s,
        appState: "loading",
        loaderThumb: thumbUrl,
        lastPayload: payload,
      }));

      runRemoval(payload, stripExtension(file.name));
    },
    [setError, runRemoval], // 3. Added runRemoval dependency
  );

  const processUrl = useCallback(
    (url: string) => {
      const payload: Payload = { type: "url", url };
      setState((s) => ({
        ...s,
        appState: "loading",
        loaderThumb: url,
        lastPayload: payload,
      }));
      runRemoval(payload, "image");
    },
    [runRemoval],
  ); // 4. Added runRemoval dependency

  const retry = useCallback(() => {
    setState((s) => {
      if (!s.lastPayload) return { ...s, appState: "upload" };
      const name =
        s.lastPayload.type === "file"
          ? stripExtension(s.lastPayload.file.name)
          : "image";

      // Use the stable runRemoval
      setTimeout(() => runRemoval(s.lastPayload!, name), 0);

      return { ...s, appState: "loading", error: null };
    });
  }, [runRemoval]); // 5. Added runRemoval dependency

  const reset = useCallback(() => {
    setState({
      appState: "upload",
      result: null,
      error: null,
      loaderThumb: "",
      lastPayload: null,
    });
  }, []);

  return { ...state, processFile, processUrl, retry, reset };
}
