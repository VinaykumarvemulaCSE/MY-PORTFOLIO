# Vinay Kumar Vemula — Portfolio

Personal portfolio and case-study site for Vinay Kumar Vemula.

**Live:** [https://vinaykumar.eu.cc](https://vinaykumar.eu.cc)

The site is a Next.js App Router application with a small built-in CMS. Public content lives in Firestore, media lives in Cloudinary, and every page is rendered from CMS data — there is no hardcoded portfolio content to keep in sync.

---

## Features

### Public site

- Single-page home with hero, about, skills, featured projects, certificates, and contact sections.
- Featured projects are ordered from the CMS and limited by a configurable homepage count (default 5). If no project is featured, published projects fill those slots.
- Project archive with text search, category filters, and an interactive project modal.
- Home carousel supports drag, pagination dots, and previous/next controls.
- Project case-study pages with galleries, technical notes, links, and schema.org structured data.
- Certificate archive and detail pages with credential metadata and verification links.
- Project image lightbox with fit/fill controls; project galleries and certificate images are never force-cropped.
- Contact form with server-side validation, a honeypot field, and shared IP rate limiting.
- Command menu (`Ctrl/Cmd + K`), mobile bottom navigation, scroll-to-top, and reduced-motion support.
- Installable PWA with a network-first offline fallback for page navigations.
- SEO metadata, Open Graph image, `robots.txt`, `sitemap.xml`, and JSON-LD for projects, certificates, and the profile.

### Admin CMS

Available at `/admin` after Firebase Authentication login.
- Edit the profile, hero copy, focus areas, education, contact details, social links, résumé, and site metadata.
- Create, edit, publish, feature, order, and delete projects and certificates.
- Quick project reordering with homepage badges, cut warnings, and one-click move up/down.
- Configure the homepage project limit in Profile → Site metadata (1–20).
- Upload media directly to Cloudinary from the browser.
- Multi-image galleries with upload, drag/drop, URL entry, reordering, cover selection, per-image alt text, and full-size previews.
- Skill icon autocomplete and live preview from the supported icon map.
- Server-side Zod validation for every CMS write.
- Toast feedback and on-demand revalidation of public routes after saves.
- Deletion/replacement cleanup of unused Cloudinary assets in the `portfolio/` folder only.

See [`CMS.md`](./CMS.md) for the detailed CMS operator guide.

---

## Tech stack

| Area       | Technology                                                           |
| ---------- | -------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Components, Server Actions)           |
| UI         | React 19, Tailwind CSS 4, Motion, Embla Carousel, `cmdk`             |
| Language   | TypeScript with `strict`, `noUnusedLocals`, and `noUnusedParameters` |
| Content    | Firebase Firestore                                                   |
| Auth       | Firebase Authentication + httpOnly session cookies                   |
| Server SDK | `firebase-admin`                                                     |
| Media      | Cloudinary signed direct uploads                                     |
| Email      | Nodemailer over SMTP                                                 |
| Validation | Zod                                                                  |
| Quality    | Biome, TypeScript, GitHub Actions                                    |
| Hosting    | Vercel                                                               |

---

## Routes

| Route                        | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| `/`                          | Home page; profile, skills, featured projects, certificates, and contact |
| `/projects`                  | Searchable/filterable project archive                                    |
| `/work/[slug]`               | Project case study                                                       |
| `/certificates`              | Searchable/filterable certificate archive                                |
| `/certificates/[slug]`       | Certificate detail page                                                  |
| `/admin/login`               | Firebase admin login                                                     |
| `/admin`                     | Protected CMS dashboard                                                  |
| `/admin/profile`             | Profile editor                                                           |
| `/admin/projects`            | Project list                                                             |
| `/admin/projects/new`        | New project                                                              |
| `/admin/projects/[slug]`     | Edit project                                                             |
| `/admin/certificates`        | Certificate list                                                         |
| `/admin/certificates/new`    | New certificate                                                          |
| `/admin/certificates/[slug]` | Edit certificate                                                         |
| `/admin/skills`              | Skill group editor                                                       |
| `/api/admin/session`         | Create/delete the admin session cookie                                   |
| `/api/admin/upload`          | Return an auth-guarded Cloudinary upload signature                       |
| `/api/contact`               | Validate and send a contact message                                      |

---

## Architecture

```text
Browser
  │
  ├── Public pages ────────────────► Next.js server ──► Firestore (Admin SDK)
  │                                      │
  │                                      └──► Cloudinary (image optimisation)
  │
  ├── /admin/login ─────────────────► Firebase Auth
  │                                      │
  │                                      └──► ID token ──► /api/admin/session
  │                                                          │
  │                                                          └──► httpOnly cookie
  │
  ├── /admin ───────────────────────► Server Actions ──► Firestore
  │                                      │
  │                                      └──► Cloudinary cleanup
  │
  └── Upload request ───────────────► /api/admin/upload (session required)
                                         │
                                         └──► signature ──► browser ──► Cloudinary
```

The public content layer is in `src/lib/content.ts`. It reads through the Firebase Admin SDK, so content is available during static generation and server rendering even when browser-side Firestore rules deny access.

Firestore documents are validated against the schemas in `src/lib/schemas.ts`; invalid documents are logged and skipped rather than crashing a public page.

---

## Repository layout

```text
src/
  app/
    (site)/                 Public pages and shared site chrome
    admin/                  Login and protected CMS pages
    api/                    Session, upload, and contact endpoints
    manifest.ts             PWA manifest
    opengraph-image.tsx     Generated social image
    robots.ts               robots.txt
    sitemap.ts              Sitemap
  components/
    admin/                  CMS forms, media fields, shell
    certificates/           Certificate cards and modal
    projects/               Project cards, modal, utilities
    ui/                     Small shared UI pieces
  constants/techIcons.ts    Technology → icon/colour map
  hooks/                    Intersection and scroll hooks
  lib/
    cloudinary.ts           Safe asset cleanup
    content.ts              Public read layer
    firebase/               Admin/client SDK setup, Firestore, sessions
    rate-limit.ts           Shared contact rate limiter
    schemas.ts              Zod schemas
    site.ts                 Canonical URL helpers
    types.ts                View-model types
public/
  sw.js                     Offline service worker
  offline.html              Offline fallback
  resume.pdf                Default résumé
firestore.rules             Browser-side Firestore security rules
next.config.ts              Image domains, security headers, CSP
CMS.md                      CMS operator documentation
.env.example                Required environment variables
```

---

## Getting started

### Prerequisites

- Node.js **24.x** recommended (Next.js 16 requires Node.js 20.9+)
- npm
- A Firebase project with Authentication and Firestore
- A Cloudinary account
- An SMTP account for the contact form

### Install and run

```bash
npm install
cp .env.example .env.local
```

On PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
```

Fill in `.env.local`, then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Firebase credentials the site builds, but the public pages show empty states and `/admin` is unavailable. With credentials configured, Firestore is the only source of content.

---

## Environment variables

Copy `.env.example` and fill in the values. Do not commit `.env.local`.

| Variable                                   | Scope  | Purpose                                                          |
| ------------------------------------------ | ------ | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                     | Public | Canonical site URL, e.g. `https://vinaykumar.eu.cc`              |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Public | Firebase web app config                                          |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Public | Firebase Auth domain                                             |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Public | Firebase project ID                                              |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Public | Firebase storage bucket                                          |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public | Firebase sender ID                                               |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Public | Firebase web app ID                                              |
| `FIREBASE_PROJECT_ID`                      | Server | Firebase Admin project ID                                        |
| `FIREBASE_CLIENT_EMAIL`                    | Server | Service-account client email                                     |
| `FIREBASE_PRIVATE_KEY`                     | Server | Service-account private key; keep literal `\n` escapes on Vercel |
| `ADMIN_EMAILS`                             | Server | Comma-separated Firebase Auth email allowlist for `/admin`       |
| `CLOUDINARY_CLOUD_NAME`                    | Server | Cloudinary cloud name                                            |
| `CLOUDINARY_API_KEY`                       | Server | Cloudinary API key                                               |
| `CLOUDINARY_API_SECRET`                    | Server | Cloudinary API secret                                            |
| `SMTP_HOST`                                | Server | SMTP host, e.g. `smtp.gmail.com`                                 |
| `SMTP_PORT`                                | Server | SMTP port, e.g. `587`                                            |
| `SMTP_USER`                                | Server | SMTP username                                                    |
| `SMTP_PASS`                                | Server | SMTP password or app password                                    |
| `SMTP_FROM`                                | Server | From address for contact email                                   |
| `CONTACT_TO`                               | Server | Optional recipient; defaults to the profile email                |

Notes:
- `FIREBASE_PRIVATE_KEY` may contain escaped newlines. The app converts them at runtime.
- The `NEXT_PUBLIC_*` Firebase values are safe to expose; they are web-client identifiers, not service-account secrets.
- `ADMIN_EMAILS` is re-checked on every session verification, so removing an address revokes existing admin cookies immediately.

---

## Firebase setup

1. Create a Firebase project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Add the admin user under **Authentication → Users**.
4. Create Firestore in production mode.
5. Seed the content documents (Firestore creates each collection automatically):
   - `profile/main`
   - `projects/{slug}`
   - `certificates/{slug}`
   - `skills/{id}`
6. Generate a service-account key under **Project settings → Service accounts** and copy the three Admin SDK values into `.env.local`.
7. Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

The rules allow public reads of published projects/certificates and deny browser-side writes unless an `admins/{uid}` document exists. The Next.js server writes with the Admin SDK, which bypasses Firestore rules; the `/admin` session allowlist is the application-level guard.

### Firestore collections

| Path                      | Purpose                                                              |
| ------------------------- | -------------------------------------------------------------------- |
| `profile/main`            | Profile, hero, biography, education, contact, socials, site metadata |
| `projects/{slug}`         | Project content, gallery, case study, links, publish/featured/order  |
| `certificates/{slug}`     | Certificate content, image, credential metadata, publish/order       |
| `skills/{id}`             | Skill groups and icon keys                                           |
| `rateLimits/{sha256(ip)}` | Shared contact-form rate-limit state                                 |

Project and certificate documents store the view-model shape from `src/lib/types.ts`, plus `published` and `order`.

### Firestore TTL

The contact rate limiter writes an `expiresAt` timestamp. Create a Firestore TTL policy on `rateLimits.expiresAt` so expired counters are deleted automatically. Without TTL, the documents are harmless but accumulate.

---

## Cloudinary setup

- Uploads go directly from the browser to Cloudinary. The app only signs the request.
- `/api/admin/upload` requires an authenticated admin session.
- All uploads are placed in the `portfolio/` folder.
- Images and PDFs up to 10 MB are accepted by the upload UI.
- PDF delivery must be enabled in Cloudinary under **Settings → Security → Allow delivery of PDF and ZIP files**.
- Only `res.cloudinary.com` is allowed by `next/image`; upload media there instead of using arbitrary external image hosts.
- When a project, certificate, profile image, or résumé is replaced or deleted, the old asset is deleted only if no other Firestore document references it.
- Cleanup is intentionally limited to the configured cloud's `portfolio/` folder.

---

## CMS notes

The home page displays featured projects first, sorted by `order`, limited by the homepage project count in Profile → Site metadata (default 5). If no project is marked featured, published projects are used as the fallback pool. The admin project list shows order badges, which projects are on the homepage, and a warning when featured projects fall below the cut. The home carousel is used when more than three projects are shown; otherwise a grid is used.

Unchecking **Published** hides an item from public reads without deleting it. Admin saves use targeted `revalidatePath` calls: profile changes refresh the shared layout and metadata routes, while project and certificate changes refresh only the affected archive/detail pages. New project/certificate slugs are rendered on demand and cached afterward.

Full editing instructions live in [`CMS.md`](./CMS.md).

---

## Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the development server    |
| `npm run build`     | Create a production build       |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | Run Biome checks                |
| `npm run lint:fix`  | Apply safe Biome fixes          |
| `npm run format`    | Format with Biome               |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run check`     | Run lint and typecheck          |

There is currently no unit or end-to-end test suite. CI validates lint, production build, and typecheck.

---

## Deployment

The production site runs on Vercel with Node.js 24.x.
1. Import the repository into Vercel.
2. Add every variable from `.env.example` to the **Production** and **Preview** environments.
3. Set `NEXT_PUBLIC_SITE_URL` to the real public domain.
4. Deploy the Firestore rules.
5. Confirm Cloudinary PDF delivery is enabled.
6. Deploy.

Operational details:
- Public pages are generated from Firestore at build time. A misconfigured service account fails the build/render instead of silently publishing an empty portfolio.
- Admin saves revalidate public routes on demand.
- Public reads filter drafts in Firestore; only the CMS reads unpublished documents.
- Production responses include HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a Content Security Policy.
- Admin session-status and upload-signature responses use `Cache-Control: no-store`.
- Admin pages are excluded from search indexing and blocked in `robots.txt`.

### Contact form

`POST /api/contact` validates the submission with Zod, applies a Firestore-backed rate limit (five messages per ten minutes per IP), and sends the message over SMTP with the visitor's address as `Reply-To`. The in-memory limiter is only a fallback when Firestore is unavailable.

For Gmail, use an App Password rather than the account password.

---

## Security and operational notes

- Admin access requires both a valid Firebase session cookie and an email in `ADMIN_EMAILS`.
- The session cookie is `httpOnly`, `Secure` in production, and `SameSite=Lax`.
- Cloudinary cleanup only deletes assets in the `portfolio/` folder and only when unreferenced.
- The service worker never caches `/admin` or `/api` responses. Bump `CACHE_NAME` in `public/sw.js` when its caching strategy changes.
- Keep dependencies under review. `firebase-admin` is pinned to `13.10.0` because newer versions previously failed in the Vercel serverless runtime; re-test that upgrade before changing it.
- Known post-launch work: add error/uptime monitoring, configure Firestore backups, add a TTL policy for rate-limit documents, add automated tests, and periodically review transitive dependency advisories.

---

## SEO and metadata

- Canonical URLs are generated from `NEXT_PUBLIC_SITE_URL`.
- The root layout ships a generated Open Graph image.
- Project, certificate, and profile pages emit JSON-LD with absolute Cloudinary image URLs.
- `robots.txt` allows public pages and blocks `/api/` and `/admin`.
- `sitemap.xml` includes the home, archives, and every published project/certificate slug.

---

## Troubleshooting

### The site builds but shows no content

Check the Firebase Admin variables. Public content is read through the Admin SDK, not the browser config. If the service account is missing, the app intentionally shows empty states.

### Build fails while reading Firestore

- Verify `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
- On Vercel, keep the private key's literal `\n` sequences in one environment-variable value.
- Confirm the service account has access to the project's Firestore database.

### Admin login succeeds but `/admin` redirects back to login

- Confirm the signed-in email is present in `ADMIN_EMAILS`.
- Check that the Firebase web config and Admin SDK point to the same project.
- Clear the old `admin_session` cookie and sign in again.

### Images do not load

- Only `res.cloudinary.com` is allowlisted in `next.config.ts`.
- Make sure the image was uploaded to Cloudinary and the stored URL is not a different host.
- For PDFs, enable PDF delivery in Cloudinary.

### Contact form does not send

- Verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
- For Gmail, use an App Password.
- Check `CONTACT_TO`; when empty, the profile email is used.
- Remember the rate limit: five messages per ten minutes per IP.

### Content changes do not appear

- A save should call `revalidatePath`. Confirm the save succeeded in the admin UI.
- Service-worker HTML navigations are network-first; if an old page is still visible, verify `public/sw.js` and bump `CACHE_NAME` after changing caching behavior.
- Vercel preview deployments may use a different `NEXT_PUBLIC_SITE_URL`; set it explicitly for each environment.

---

## Documentation map

| File              | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `README.md`       | Setup, architecture, scripts, deployment, and operations |
| `CMS.md`          | Admin dashboard and content-editing guide                |
| `.env.example`    | Environment-variable template                            |
| `firestore.rules` | Firestore security rules                                 |

---

## License

This is a personal portfolio project. Add an explicit license here if you intend to make the code reusable by others. Portfolio copy, images, certificates, and résumé content belong to Vinay Kumar Vemula.
