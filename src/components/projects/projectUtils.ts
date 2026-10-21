import type { ProjectViewModel } from "@/lib/types";

export function getProjectImages(project: ProjectViewModel): string[] {
  return [
    ...new Set(
      [project.coverImage, ...(project.gallery ?? [])].filter((image): image is string =>
        Boolean(image)
      )
    ),
  ];
}

/**
 * Cards need a short, readable hook. Older project descriptions contain full
 * README-style notes, so fall back to the first real prose paragraph instead of
 * dumping the whole write-up into a two-line card.
 */
export function getProjectSummary(project: ProjectViewModel): string {
  const tagline = project.tagline?.trim();
  if (tagline) return tagline;

  const lines = (project.description || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const skip = /^(?:overview|problem|solution|tech stack|features?)\b/i;
  const candidate =
    lines.find((line) => line.length >= 60 && !skip.test(line)) ??
    lines.find((line) => !skip.test(line)) ??
    "";

  const cleaned = candidate
    .replace(/^[^\p{L}\p{N}]+/u, "")
    .replace(/^#+\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 180 ? `${cleaned.slice(0, 177).trimEnd()}…` : cleaned;
}
