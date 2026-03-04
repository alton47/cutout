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

  // Standard function declaration solves the "access before declaration" recursion error
  async function runRemoval(
    payload: Payload,
    originalFileName: string,
    retries = 2,
  ) {
    try {
      const formData = new FormData();
      payload.type === "file"
        ? formData.append("image_file", payload.file)
        : formData.append("image_url", payload.url);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") ?? "10", 10);
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
    } catch {
      if (retries > 0) {
        await sleep(1200);
        return runRemoval(payload, originalFileName, retries - 1);
      }
      setError("Network error", "Check your connection.");
    }
  }

  const processFile = useCallback(
    (file: File) => {
      const err = validateImageFile(file);
      if (err) return setError("Invalid file", err);
      const payload: Payload = { type: "file", file };
      setState((s) => ({
        ...s,
        appState: "loading",
        loaderThumb: URL.createObjectURL(file),
        lastPayload: payload,
      }));
      runRemoval(payload, stripExtension(file.name));
    },
    [setError],
  );

  const processUrl = useCallback((url: string) => {
    const payload: Payload = { type: "url", url };
    setState((s) => ({
      ...s,
      appState: "loading",
      loaderThumb: url,
      lastPayload: payload,
    }));
    runRemoval(payload, "image");
  }, []);

  const retry = useCallback(() => {
    setState((s) => {
      if (!s.lastPayload) return { ...s, appState: "upload" };
      const name =
        s.lastPayload.type === "file"
          ? stripExtension(s.lastPayload.file.name)
          : "image";
      setTimeout(() => runRemoval(s.lastPayload!, name), 0);
      return { ...s, appState: "loading" };
    });
  }, []);

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
