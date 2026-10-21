"use client";

import { useRef, useState } from "react";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";

import { Field, inputClass } from "./ui";
import { isPdf, uploadFile } from "./upload";

/**
 * URL field plus a drag-and-drop upload zone. Files go through the signed
 * Cloudinary route and the returned URL is stored in the text input.
 */
export function ImageField({
  name,
  label,
  defaultValue,
  hint,
  accept = "image/*",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  accept?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");

    try {
      setUrl(await uploadFile(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Field label={label} hint={hint}>
        <div className="relative">
          <input
            type="text"
            name={name}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://… or /path/from/public"
            className={`${inputClass} pr-9`}
          />
          {url ? (
            <button
              type="button"
              onClick={() => setUrl("")}
              aria-label={`Clear ${label}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <FiX size={14} />
            </button>
          ) : null}
        </div>
      </Field>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-4 text-xs transition ${
          dragging
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground"
        }`}
      >
        <FiUploadCloud size={16} />
        <span>
          Drag &amp; drop or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            browse
          </button>
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {busy ? <p className="text-xs text-muted-foreground">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}

      {url ? (
        isPdf(url) ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
          >
            <FiFileText size={14} /> Open uploaded PDF
          </a>
        ) : (
          // biome-ignore lint/performance/noImgElement: arbitrary remote URLs
          <img
            src={url}
            alt=""
            className="mt-1 h-24 w-auto max-w-full rounded-lg border border-border object-cover"
          />
        )
      ) : null}
    </div>
  );
}
