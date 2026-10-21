"use client";

import { useRef, useState } from "react";
import { FiArrowDown, FiArrowUp, FiImage, FiPlus, FiUploadCloud, FiX } from "react-icons/fi";

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
 * promote one to the project cover, or remove/add URLs by hand. Stores one URL
 * per line in a hidden input, which matches the newline format the server action
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
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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
          <p className="text-[11px] text-muted-foreground">
            Use the arrows to set the gallery order. The cover image is always shown first.
          </p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {urls.map((url, index) => (
              <li
                key={url}
                className="group relative overflow-hidden rounded-lg border border-border"
              >
                {/* biome-ignore lint/performance/noImgElement: admin previews arbitrary Cloudinary URLs */}
                <img src={url} alt="" className="h-20 w-full object-cover" />

                <span className="absolute left-1 top-1 rounded bg-background/85 px-1.5 py-0.5 text-[10px] font-mono text-foreground">
                  #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => setUrls((current) => current.filter((_, i) => i !== index))}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-muted-foreground transition hover:text-red-300"
                >
                  <FiX size={12} />
                </button>

                <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-background/85 p-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move image ${index + 1} up`}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <FiArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === urls.length - 1}
                    aria-label={`Move image ${index + 1} down`}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    <FiArrowDown size={12} />
                  </button>
                  {coverFieldName ? (
                    <button
                      type="button"
                      onClick={() => makeCover(url)}
                      aria-label={`Use image ${index + 1} as cover`}
                      className={`ml-auto inline-flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-medium ${
                        coverUrl === url
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FiImage size={12} /> {coverUrl === url ? "Cover" : "Set cover"}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">No gallery images yet.</p>
      )}

      {busy ? <p className="text-xs text-primary">Uploading…</p> : null}
    </div>
  );
}
