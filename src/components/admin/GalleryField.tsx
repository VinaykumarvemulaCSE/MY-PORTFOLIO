"use client";

import { useRef, useState } from "react";
import { FiPlus, FiUploadCloud, FiX } from "react-icons/fi";

import { Field, inputClass } from "./ui";
import { uploadFile } from "./upload";

/**
 * Multi-image field: drop several files, upload them one by one, and remove or
 * add URLs by hand. Stores one URL per line in a hidden input, which matches the
 * newline format the server action parses.
 */
export function GalleryField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [manual, setManual] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setUrls((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setUrls((current) => [...current, ...uploaded]);
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <div className="flex flex-col gap-3">
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
            setUrls((current) => [...current, manual.trim()]);
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
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url, index) => (
            <li
              key={url}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              {/* biome-ignore lint/performance/noImgElement: arbitrary remote URLs */}
              <img src={url} alt="" className="h-20 w-full object-cover" />
              <button
                type="button"
                onClick={() => setUrls((current) => current.filter((_, i) => i !== index))}
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 transition hover:text-red-300 group-hover:opacity-100"
              >
                <FiX size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No gallery images yet.</p>
      )}

      {busy ? <p className="text-xs text-primary">Uploading…</p> : null}
    </div>
  );
}
