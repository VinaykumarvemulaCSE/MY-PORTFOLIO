/**
 * The Studio is a Vite app nested inside the Next.js project. Without a local
 * PostCSS config, Vite walks up and picks up the site's `postcss.config.js`,
 * which runs Tailwind and an older `autoprefixer`/`browserslist` pair against
 * Sanity's bundled CSS and fails with "Unknown browser baseline".
 *
 * The Studio ships its own compiled CSS, so it needs no PostCSS plugins.
 */
export default {
  plugins: {},
};
