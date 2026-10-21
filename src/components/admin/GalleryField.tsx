"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiImage,
  FiMaximize2,
  FiPlus,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import { Field, inputClass } from "./ui";
import { uploadFile } from "./upload";

function addUnique(current: string[], incoming: string[]): string[] {
  const next = [...current];
  for (const url of incoming) {
    const trimmed = url.trim();
    if (trimmed && !next.includes(trimmed)) next.push(trimmed);
  }
  return next;
}

/**
 * Multi-image field: drop several files, upload them one by one, reorder them,
 * preview in high-res, promote one to the project cover, or remove/add URLs by hand.
 * Stores one URL per line in a hidden input, which matches the newline format the server action
 * parses.
 */
export function GalleryField({
  name,
  label,
  defaultValue,
  coverFieldName,
  coverImage,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  coverFieldName?: string;
  coverImage?: string;
}) {
  const [urls, setUrls] = useState<string[]>(() => Array.from(new Set(defaultValue ?? [])));
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [coverUrl, setCoverUrl] = useState(coverImage ?? "");
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for preview lightbox
  useEffect(() => {
    if (previewIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewIndex(null);
      } else if (event.key === "ArrowLeft") {
        setPreviewIndex((idx) => (idx !== null && idx > 0 ? idx - 1 : idx));
      } else if (event.key === "ArrowRight") {
        setPreviewIndex((idx) => (idx !== null && idx < urls.length - 1 ? idx + 1 : idx));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, urls.length]);

  async function handleFiles(files: FileList | File[] | null) {
    const list = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
    if (list.length === 0) return;

    setBusy(true);
    setError("");
    const uploaded: string[] = [];

    try {
      for (const [index, file] of list.entries()) {
        setProgress(`Uploading ${index + 1}/${list.length}…`);
        uploaded.push(await uploadFile(file));
      }
      setUrls((current) => addUnique(current, uploaded));
    } catch (uploadError) {
      setUrls((current) => addUnique(current, uploaded));
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function move(index: number, direction: -1 | 1) {
    setUrls((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  /**
   * The cover input is a sibling controlled field, so update the native value
   * and fire the events React listens to. This avoids lifting the whole form
   * into client state just for one shortcut.
   */
  function makeCover(url: string) {
    if (!coverFieldName) return;
    const form = rootRef.current?.closest("form");
    const input = form?.querySelector<HTMLInputElement>(`input[name="${coverFieldName}"]`);
    if (!input) return;

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(input, url);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    setCoverUrl(url);
  }

  function markFailed(url: string) {
    setFailedUrls((prev) => ({ ...prev, [url]: true }));
  }

  const activePreviewUrl = previewIndex !== null ? urls[previewIndex] : null;

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <input type="hidden" name={name} value={urls.join("\n")} />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-6 text-center text-xs transition ${
            dragging
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground"
          }`}
        >
          <FiUploadCloud size={18} />
          <p>
            Drop images here, or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              browse
            </button>
          </p>
          <p className="text-[11px] opacity-80">Multiple files supported</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Field label="Add image by URL" className="flex-1">
          <input
            type="url"
            value={manual}
            onChange={(event) => setManual(event.target.value)}
            placeholder="https://res.cloudinary.com/…"
            className={inputClass}
          />
        </Field>
        <button
          type="button"
          onClick={() => {
            if (!manual.trim()) return;
            setUrls((current) => addUnique(current, [manual]));
            setManual("");
          }}
          className="mt-5 inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          <FiPlus size={13} /> Add
        </button>
      </div>

      {progress ? <p className="text-xs text-muted-foreground">{progress}</p> : null}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}

      {urls.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {urls.length} {urls.length === 1 ? "image" : "images"} in gallery. Click any thumbnail
              to preview full-size.
            </span>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {urls.map((url, index) => {
              const isCover = coverUrl === url;
              const hasFailed = failedUrls[url];

              return (
                <li
                  key={url}
                  className={`group relative flex flex-col overflow-hidden rounded-xl border transition ${
                    isCover
                      ? "border-primary/60 bg-primary/5 shadow-sm"
                      : "border-border bg-card/40 hover:border-border/80"
                  }`}
                >
                  {/* Top card bar with badge & remove */}
                  <div className="flex items-center justify-between border-b border-border/40 bg-background/70 px-2 py-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-muted-foreground">#{index + 1}</span>
                      {isCover ? (
                        <span className="rounded bg-primary/20 px-1 text-[10px] font-medium text-primary">
                          Cover
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUrls((current) => current.filter((_, i) => i !== index));
                        setPreviewIndex((current) => {
                          if (current === null || current === index) return null;
                          return current > index ? current - 1 : current;
                        });
                      }}
                      aria-label={`Remove image ${index + 1}`}
                      className="rounded p-0.5 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <FiX size={13} />
                    </button>
                  </div>

                  {/* Thumbnail area with uncropped preview & click-to-enlarge */}
                  <button
                    type="button"
                    onClick={() => setPreviewIndex(index)}
                    aria-label={`Preview gallery image ${index + 1}`}
                    className="relative flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden bg-black/40 p-1.5 transition group-hover:bg-black/60 text-left"
                  >
                    {hasFailed ? (
                      <div className="p-2 text-center text-[10px] text-muted-foreground">
                        Failed to load
                      </div>
                    ) : (
                      // biome-ignore lint/performance/noImgElement: admin previews arbitrary Cloudinary URLs
                      <img
                        src={url}
                        alt={`Gallery item ${index + 1}`}
                        onError={() => markFailed(url)}
                        className="max-h-full max-w-full rounded object-contain transition duration-200 group-hover:scale-105"
                      />
                    )}

                    {/* Hover preview hint */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-[10px] font-medium text-foreground shadow-md backdrop-blur-sm">
                        <FiMaximize2 size={11} /> Preview
                      </span>
                    </div>
                  </button>

                  {/* Bottom toolbar */}
                  <div className="flex items-center justify-between border-t border-border/40 bg-background/80 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move image ${index + 1} backward`}
                        title="Move backward"
                        className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-25"
                      >
                        <FiArrowUp size={12} className="rotate-[-45deg] sm:rotate-0" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === urls.length - 1}
                        aria-label={`Move image ${index + 1} forward`}
                        title="Move forward"
                        className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-25"
                      >
                        <FiArrowDown size={12} className="rotate-[-45deg] sm:rotate-0" />
                      </button>
                    </div>

                    {coverFieldName ? (
                      <button
                        type="button"
                        onClick={() => makeCover(url)}
                        aria-label={`Use image ${index + 1} as cover`}
                        disabled={isCover}
                        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                          isCover
                            ? "cursor-default text-primary"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <FiImage size={11} /> {isCover ? "Is Cover" : "Make Cover"}
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">No gallery images yet.</p>
      )}

      {busy ? <p className="text-xs text-primary">Uploading…</p> : null}

      {/* Lightbox Modal for Full Preview */}
      {previewIndex !== null && activePreviewUrl ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setPreviewIndex(null)}
        >
          {/* Prevent clicks on modal container from closing backdrop */}
          <div
            role="document"
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  Image {previewIndex + 1} of {urls.length}
                </span>
                {coverUrl === activePreviewUrl ? (
                  <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    Current Cover
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {coverFieldName && coverUrl !== activePreviewUrl ? (
                  <button
                    type="button"
                    onClick={() => makeCover(activePreviewUrl)}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    <FiImage size={12} /> Set as Cover
                  </button>
                ) : null}

                <a
                  href={activePreviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                >
                  <FiExternalLink size={12} /> Open original
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Close preview"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex min-h-[300px] max-h-[75vh] w-full items-center justify-center overflow-auto bg-black/60 p-4">
              {/* Previous button */}
              {previewIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setPreviewIndex(previewIndex - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur hover:bg-background"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={20} />
                </button>
              ) : null}

              {/* Next button */}
              {previewIndex < urls.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setPreviewIndex(previewIndex + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-lg backdrop-blur hover:bg-background"
                  aria-label="Next image"
                >
                  <FiChevronRight size={20} />
                </button>
              ) : null}

              {/* biome-ignore lint/performance/noImgElement: arbitrary remote preview */}
              <img
                src={activePreviewUrl}
                alt={`Gallery expanded item ${previewIndex + 1}`}
                className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            {/* Footer with URL info */}
            <div className="flex items-center justify-between border-t border-border/60 bg-background/70 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="truncate font-mono">{activePreviewUrl}</span>
              <span className="shrink-0 text-[10px]">Use Esc or Arrow keys</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
