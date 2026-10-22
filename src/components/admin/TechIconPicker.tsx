"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiCode, FiSearch, FiX } from "react-icons/fi";

import { normalizeTechIconKey, resolveTechIconValue, TECH_ICONS } from "@/constants/techIcons";

const ENTRIES = Object.entries(TECH_ICONS).sort(([, a], [, b]) => a.name.localeCompare(b.name));

function normalizeValues(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => normalizeTechIconKey(value) ?? value)
    )
  );
}

interface TechIconPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  name?: string;
  emptyLabel?: string;
  className?: string;
}

export function TechIconPicker({
  value,
  onChange,
  multiple = false,
  name,
  emptyLabel = "Choose an icon",
  className,
}: TechIconPickerProps) {
  const selected = normalizeValues(value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedSet = new Set(selected);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return ENTRIES;
    return ENTRIES.filter(
      ([key, info]) => key.toLowerCase().includes(term) || info.name.toLowerCase().includes(term)
    );
  }, [query]);

  const firstInfo = selected.length > 0 ? resolveTechIconValue(selected[0]) : undefined;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function openPicker() {
    setQuery("");
    setOpen(true);
  }

  function closePicker() {
    setOpen(false);
    setQuery("");
  }

  function toggle(key: string) {
    if (multiple) {
      onChange(
        selectedSet.has(key) ? selected.filter((value) => value !== key) : [...selected, key]
      );
      return;
    }

    onChange([key]);
    closePicker();
  }

  const triggerText = multiple
    ? selected.length > 0
      ? `${selected.length} selected`
      : emptyLabel
    : (firstInfo?.name ?? selected[0] ?? emptyLabel);

  return (
    <div className={className}>
      {name ? <input type="hidden" name={name} value={selected.join(", ")} /> : null}

      <button
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm text-foreground transition hover:border-primary/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          {!multiple && firstInfo ? (
            <firstInfo.icon size={16} style={{ color: firstInfo.color }} className="shrink-0" />
          ) : (
            <FiCode size={16} className="shrink-0 text-muted-foreground" />
          )}
          <span className={`truncate ${selected.length > 0 ? "" : "text-muted-foreground/60"}`}>
            {triggerText}
          </span>
        </span>
        <FiChevronDown size={15} className="shrink-0 text-muted-foreground" />
      </button>

      {multiple && selected.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((key) => {
            const info = resolveTechIconValue(key);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-2 py-1 text-[11px] text-foreground"
              >
                {info ? <info.icon size={12} style={{ color: info.color }} /> : null}
                <span>{info?.name ?? key}</span>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-label={`Remove ${info?.name ?? key}`}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  <FiX size={11} />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close icon picker"
            onClick={closePicker}
            className="absolute inset-0 bg-background/85 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a technology icon"
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <h3 className="font-heading text-lg text-foreground">
                  {multiple ? "Choose technologies" : "Choose an icon"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {multiple
                    ? "Pick every technology shown on this project."
                    : "Search or pick from the full icon library."}
                </p>
              </div>
              <button
                type="button"
                onClick={closePicker}
                aria-label="Close"
                className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary/40 hover:text-foreground"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="border-b border-border p-3">
              <div className="relative">
                <FiSearch
                  size={15}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.preventDefault();
                  }}
                  placeholder="Search icons…"
                  className="w-full rounded-lg border border-border bg-background/60 py-2 pr-3 pl-9 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3">
              {filtered.map(([key, info]) => {
                const isSelected = selectedSet.has(key);
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggle(key)}
                    className={`flex min-w-0 items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                      isSelected
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <info.icon size={18} style={{ color: info.color }} className="shrink-0" />
                    <span className="truncate">{info.name}</span>
                    {isSelected ? (
                      <FiCheck size={14} className="ml-auto shrink-0 text-primary" />
                    ) : null}
                  </button>
                );
              })}
              {filtered.length === 0 ? (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  No icons match “{query}”.
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border p-3">
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  if (!multiple) closePicker();
                }}
                className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-red-300"
              >
                Clear
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{selected.length} selected</span>
                <button
                  type="button"
                  onClick={closePicker}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  {multiple ? "Done" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
