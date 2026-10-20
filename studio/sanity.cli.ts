import { defineCliConfig } from "sanity/cli";

/**
 * CLI configuration.
 *
 * `projectId` and `dataset` are read from environment variables so this file
 * never contains project-specific secrets. Create a `.env` file next to this
 * one (see `.env.example` in the repository root) or export them in your shell:
 *
 *   SANITY_STUDIO_PROJECT_ID=xxxxxxxx
 *   SANITY_STUDIO_DATASET=production
 */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Set this once, after `npx sanity deploy` asks you to pick a hostname.
   * It becomes https://<studioHost>.sanity.studio
   */
  studioHost: process.env.SANITY_STUDIO_HOST ?? undefined,
});
