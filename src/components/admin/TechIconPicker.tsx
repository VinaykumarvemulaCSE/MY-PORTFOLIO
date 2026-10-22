"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FiCheck, FiChevronDown, FiCode, FiSearch, FiX } from "react-icons/fi";

import { TechIcon } from "@/components/TechIcon";
import {
  EXTRA_TECH_ICONS,
  getRemoteIconKey,
  normalizeTechIconKey,
  resolveTechIconValue,
  TECH_ICONS,
} from "@/constants/techIcons";
import type { ProjectTech } from "@/lib/types";

interface SimpleIconEntry {
  title: string;
  slug: string;
  hex: string;
  aliases?: string[];
}

interface CatalogOption {
  key: string;
  name: string;
  localIcon?: IconType;
  remoteIcon?: string;
  color?: string;
  aliases?: string[];
}

const CURATED_OPTIONS: CatalogOption[] = Object.entries(TECH_ICONS).map(([key, info]) => ({
  key,
  name: info.name,
  localIcon: info.icon,
  color: info.color,
}));

const EXTRA_OPTIONS: CatalogOption[] = EXTRA_TECH_ICONS.map((entry) => ({
  key: entry.icon,
  name: entry.name,
  remoteIcon: entry.icon,
}));

const POPULAR_OPTIONS = [...CURATED_OPTIONS, ...EXTRA_OPTIONS];

function simpleIconOption(entry: SimpleIconEntry): CatalogOption {
  return {
    key: `si:${entry.slug}`,
    name: entry.title,
    remoteIcon: `si:${entry.slug}`,
    color: `#${entry.hex}`,
    aliases: entry.aliases,
  };
}

function buildOptions(catalog: SimpleIconEntry[] | null): CatalogOption[] {
  const seen = new Set(POPULAR_OPTIONS.map((option) => option.name.toLowerCase()));
  const simple = (catalog ?? [])
    .map(simpleIconOption)
    .filter((option) => !seen.has(option.name.toLowerCase()));
  return [...POPULAR_OPTIONS, ...simple];
}

function readableIconName(value: string): string {
  const id = value.replace(/^si:/, "").replace(/^iconify:/, "");
  const last = id.split(":").pop() ?? id;
  return last
    .replace(/dot/g, ".")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function skillTokenToOption(token: string): CatalogOption {
  const local = resolveTechIconValue(token);
  if (local) {
    return {
      key: normalizeTechIconKey(token) ?? token,
      name: local.name,
      localIcon: local.icon,
      color: local.color,
    };
  }

  const remote = getRemoteIconKey(token);
  if (remote) {
    return {
      key: remote,
      name: readableIconName(token),
      remoteIcon: remote,
    };
  }

  return { key: token, name: token };
}

function optionToSkillToken(option: CatalogOption): string {
  return option.remoteIcon ?? option.key;
}

function projectTechToOption(tech: ProjectTech): CatalogOption {
  const local = resolveTechIconValue(tech.icon) ?? resolveTechIconValue(tech.name);
  if (local) {
    return {
      key: normalizeTechIconKey(tech.icon) ?? normalizeTechIconKey(tech.name) ?? tech.name,
      name: tech.name,
      localIcon: local.icon,
      color: tech.color ?? local.color,
    };
  }

  const remote = getRemoteIconKey(tech.icon) ?? getRemoteIconKey(tech.name);
  if (remote) {
    return {
      key: remote,
      name: tech.name,
      remoteIcon: remote,
      color: tech.color,
    };
  }

  return { key: tech.name, name: tech.name, color: tech.color };
}

function optionToProjectTech(option: CatalogOption): ProjectTech {
  return {
    name: option.name,
    ...(option.remoteIcon ? { icon: option.remoteIcon } : {}),
    ...(option.color ? { color: option.color } : {}),
  };
}

function OptionIcon({
  option,
  size = 16,
  className,
}: {
  option: CatalogOption;
  size?: number;
  className?: string;
}) {
  if (option.localIcon) {
    const Icon = option.localIcon;
    return (
      <Icon
        size={size}
        style={{ color: option.color || "currentColor" }}
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <TechIcon
      name={option.name}
      icon={option.remoteIcon}
      color={option.color}
      size={size}
      className={className}
    />
  );
}

function useSimpleIconsCatalog(open: boolean): SimpleIconEntry[] | null {
  const [catalog, setCatalog] = useState<SimpleIconEntry[] | null>(null);

  useEffect(() => {
    if (!open || catalog !== null) return;

    let cancelled = false;
    import("@/constants/simpleIcons.generated.json")
      .then((module) => {
        if (cancelled) return;
        setCatalog((module.default ?? module) as SimpleIconEntry[]);
      })
      .catch(() => {
        if (!cancelled) setCatalog([]);
      });

    return () => {
      cancelled = true;
    };
  }, [open, catalog]);

  return catalog;
}

function IconCatalogDialog({
  title,
  description,
  options,
  selectedKeys,
  multiple,
  loading,
  onSelect,
  onClear,
  onClose,
}: {
  title: string;
  description: string;
  options: CatalogOption[];
  selectedKeys: string[];
  multiple: boolean;
  loading: boolean;
  onSelect: (option: CatalogOption) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedSet = new Set(selectedKeys);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return POPULAR_OPTIONS;

    return options
      .filter((option) => {
        const haystack = [option.name, option.key, option.remoteIcon, ...(option.aliases ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, 120);
  }, [options, query]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    searchRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close icon picker"
        onClick={onClose}
        className="absolute inset-0 bg-background/85 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-4">
          <div>
            <h3 className="font-heading text-lg text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              placeholder="Search 3,400+ icons…"
              className="w-full rounded-lg border border-border bg-background/60 py-2 pr-3 pl-9 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>{query.trim() ? `${filtered.length} result(s)` : "Popular picks"}</span>
            {loading && query.trim() ? <span>Loading the full catalog…</span> : null}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((option) => {
            const isSelected = selectedSet.has(option.key);
            return (
              <button
                type="button"
                key={option.key}
                onClick={() => onSelect(option)}
                className={`flex min-w-0 items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition ${
                  isSelected
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <OptionIcon option={option} size={18} className="shrink-0" />
                <span className="truncate">{option.name}</span>
                {isSelected ? (
                  <FiCheck size={14} className="ml-auto shrink-0 text-primary" />
                ) : null}
              </button>
            );
          })}
          {filtered.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              {loading ? "Loading icons…" : `No icons match “${query}”.`}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border p-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-destructive/50 hover:text-red-300"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedKeys.length} selected</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {multiple ? "Done" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TechIconPicker({
  value,
  onChange,
  emptyLabel = "Choose an icon",
  className,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  emptyLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const catalog = useSimpleIconsCatalog(open);
  const options = useMemo(() => buildOptions(catalog), [catalog]);
  const selected = value[0] ? skillTokenToOption(value[0]) : undefined;

  function select(option: CatalogOption) {
    onChange([optionToSkillToken(option)]);
    setOpen(false);
  }

  function clear() {
    onChange([]);
    setOpen(false);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm text-foreground transition hover:border-primary/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected ? (
            <OptionIcon option={selected} size={16} className="shrink-0" />
          ) : (
            <FiCode size={16} className="shrink-0 text-muted-foreground" />
          )}
          <span className={`truncate ${selected ? "" : "text-muted-foreground/60"}`}>
            {selected?.name ?? emptyLabel}
          </span>
        </span>
        <FiChevronDown size={15} className="shrink-0 text-muted-foreground" />
      </button>

      {open ? (
        <IconCatalogDialog
          title="Choose an icon"
          description="Search the full brand catalog or pick a curated favourite."
          options={options}
          selectedKeys={selected ? [selected.key] : []}
          multiple={false}
          loading={catalog === null}
          onSelect={select}
          onClear={clear}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}

export function ProjectTechPicker({
  value,
  onChange,
  emptyLabel = "Choose technologies",
  className,
}: {
  value: ProjectTech[];
  onChange: (next: ProjectTech[]) => void;
  emptyLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const catalog = useSimpleIconsCatalog(open);
  const options = useMemo(() => buildOptions(catalog), [catalog]);
  const selected = value.map(projectTechToOption);
  const selectedKeys = selected.map((option) => option.key);

  function toggle(option: CatalogOption) {
    const exists = selectedKeys.includes(option.key);
    if (exists) {
      onChange(value.filter((_, index) => selectedKeys[index] !== option.key));
      return;
    }

    onChange([...value, optionToProjectTech(option)]);
  }

  function clear() {
    onChange([]);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm text-foreground transition hover:border-primary/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span className="flex min-w-0 items-center gap-2">
          <FiCode size={16} className="shrink-0 text-muted-foreground" />
          <span className={`truncate ${selected.length > 0 ? "" : "text-muted-foreground/60"}`}>
            {selected.length > 0 ? `${selected.length} selected` : emptyLabel}
          </span>
        </span>
        <FiChevronDown size={15} className="shrink-0 text-muted-foreground" />
      </button>

      {selected.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((option, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: selected options can repeat names
              key={`${option.key}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-2 py-1 text-[11px] text-foreground"
            >
              <OptionIcon option={option} size={12} />
              <span>{option.name}</span>
              <button
                type="button"
                onClick={() => toggle(option)}
                aria-label={`Remove ${option.name}`}
                className="text-muted-foreground transition hover:text-foreground"
              >
                <FiX size={11} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {open ? (
        <IconCatalogDialog
          title="Choose technologies"
          description="Pick every icon shown on this project. Search the full catalog for anything else."
          options={options}
          selectedKeys={selectedKeys}
          multiple
          loading={catalog === null}
          onSelect={toggle}
          onClear={clear}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
