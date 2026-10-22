import { writeFile } from "node:fs/promises";

const source = "https://cdn.jsdelivr.net/npm/simple-icons@latest/data/simple-icons.json";
const target = new URL("../src/constants/simpleIcons.generated.json", import.meta.url);

const response = await fetch(source);
if (!response.ok) {
  throw new Error(`Could not download Simple Icons: ${response.status} ${response.statusText}`);
}

const icons = await response.json();
const compact = icons.map(({ title, slug, hex, aliases }) => ({
  title,
  slug,
  hex,
  ...(aliases?.aka?.length ? { aliases: aliases.aka } : {}),
}));

await writeFile(target, `${JSON.stringify(compact)}\n`);
console.log(
  `Wrote ${compact.length} Simple Icons entries to src/constants/simpleIcons.generated.json`
);
