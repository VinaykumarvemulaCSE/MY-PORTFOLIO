import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

/**
 * Singleton documents are created with a fixed `_id` and hidden from the normal
 * "create new" flow, so there is always exactly one profile and one settings
 * document.
 */
const SINGLETONS = [
  { id: "profile", type: "profile", title: "Profile" },
  { id: "siteSettings", type: "siteSettings", title: "Site settings" },
] as const;

export default defineConfig({
  name: "vinay-portfolio",
  title: "Vinay Kumar Vemula — Portfolio",
  projectId,
  dataset,
  basePath: "/",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...SINGLETONS.map((singleton) =>
              S.listItem()
                .title(singleton.title)
                .id(singleton.id)
                .child(
                  S.document()
                    .schemaType(singleton.type)
                    .documentId(singleton.id)
                    .title(singleton.title),
                ),
            ),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("certificate").title("Certificates"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2025-01-01" }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent singletons from appearing in "create new document" menus.
    templates: (templates) =>
      templates.filter(({ schemaType }) =>
        SINGLETONS.every((singleton) => singleton.type !== schemaType),
      ),
  },
  document: {
    // Singletons should never be duplicated or deleted from the UI.
    actions: (actions, { schemaType }) =>
      SINGLETONS.some((singleton) => singleton.type === schemaType)
        ? actions.filter(({ action }) => action === "publish" || action === "discardChanges" || action === "restore")
        : actions,
  },
});
