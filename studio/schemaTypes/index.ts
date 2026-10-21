import blocks from "./blocks";
import certificate from "./certificate";
import profile from "./profile";
import project from "./project";
import siteSettings from "./siteSettings";
import skillGroup from "./skillGroup";

export const schemaTypes = [
  // Reusable objects must be registered alongside document types.
  ...blocks,
  // Documents
  profile,
  siteSettings,
  project,
  certificate,
  skillGroup,
];
