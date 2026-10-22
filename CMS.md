# Portfolio CMS

The `/admin` dashboard is a small CMS built into this Next.js app. It stores
content in Firebase (Auth + Firestore) and media in Cloudinary. **The public
site reads only from Firestore — there is no hardcoded content to fall back to.**
If the profile document is missing, the site shows a neutral "coming soon" page.

## 1. Firebase

Already provisioned for this project:
- Project: `vinnuuu`
- Auth: Email/Password enabled, admin user `kumarvinay072007@gmail.com`
- Firestore: `profile`, `projects`, `certificates`, `skills` collections seeded
- Service account: configured in `.env.local`

For a fresh environment, create a Firebase project, enable Email/Password, add
an admin user, create Firestore, and copy the web config plus a service-account
key into the environment variables listed in `.env.example`.

## 2. Environment variables

Copy `.env.example` to `.env.local` (already done here) and fill it in. On Vercel
add the same variables under **Settings → Environment Variables**.

Notes:
- `FIREBASE_PRIVATE_KEY` keeps its literal `\n` sequences; the app converts them
  to newlines at runtime.
- `ADMIN_EMAILS` is a comma-separated allowlist. Only these accounts can create
  a session, even if other Firebase users exist.
- `SMTP_*` powers the contact form. Gmail requires an **App Password** (not the
  account password) on port 587.
- `CONTACT_TO` is optional; messages default to the profile email.

## 3. Firestore rules

`firestore.rules` allows public reads of published content and denies writes
unless an `admins/{uid}` document exists. The CMS itself writes with the Admin
SDK (server-side), which bypasses rules, so the dashboard works without that
document.

Deploy from the repo root:

```bash
firebase deploy --only firestore:rules
```

or paste `firestore.rules` into **Firestore → Rules** in the console.

## 4. Cloudinary

Uploads never pass through the app server: the browser asks
`/api/admin/upload` for a short-lived signature (auth-guarded), then posts the
file straight to Cloudinary. This keeps large images and PDFs working under
Vercel's ~4.5 MB function request-body limit. Images and PDFs up to 10 MB
(Cloudinary's free-plan cap) are accepted.

Existing project, certificate and profile images were migrated to Cloudinary
and the Firestore documents now point at `res.cloudinary.com` URLs.

Deleting or replacing project/certificate/profile media also deletes the old
Cloudinary asset, but only when no other document still references it. Cleanup
is limited to the `portfolio/` folder on this Cloudinary account.

PDF delivery is enabled on this account (Settings → Security → Allow delivery of
PDF and ZIP files), so a new résumé PDF can be uploaded from the dashboard. The
current résumé is still served from `/resume.pdf`.

## 5. Editing

- `/admin/profile` — hero, bio, focus areas, education, contact, socials, site
  metadata (including the homepage project limit).
- `/admin/projects` — create/edit/delete projects, cover + gallery images
  (drag and drop, multi-file, reorder, set cover, per-image alt text), tech-stack
  icon picker, case study sections, demo credentials, publish/featured flags. Use
  the list arrows to reorder; badges show the current order and which projects
  are on the homepage.
- `/admin/certificates` — certificates archive entries, their images and
  display order.
- `/admin/skills` — skill groups with a searchable visual icon picker and live
  previews.

Every successful save shows a toast and revalidates the affected public routes.
Unchecking **Published** hides an item without deleting it. On the home page,
**Featured** projects appear first (lowest display order) up to the limit set in
Profile → Site metadata (default five); if none are featured, published projects
fill those slots. The projects list warns when featured projects fall below the
homepage cut. A carousel becomes a grid when there are three or fewer projects.

## 6. Production (Vercel)

Checklist before the first deploy:
1. Add every variable from `.env.example` to Vercel (Production **and** Preview).
   Set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. Paste `FIREBASE_PRIVATE_KEY` with its literal `\n` escapes, in one value.
3. Deploy Firestore rules (`firebase deploy --only firestore:rules`) or paste
   them into the console.
4. Confirm the Cloudinary PDF toggle is on, and that the account is allowed to
   deliver `res.cloudinary.com` assets.

Operational notes:
- Static pages are generated from Firestore at build time. If the service
  account is misconfigured the build/render fails loudly instead of publishing
  an empty portfolio.
- Admin saves call `revalidatePath`, so Vercel's cache is purged without a
  redeploy. New project/certificate slugs render on demand and are cached after
  the first request.
- Public project and certificate reads filter drafts in Firestore; only the CMS
  reads unpublished documents.
- The contact rate limit is stored in Firestore (`rateLimits/{sha256(ip)}`) so it
  is shared across serverless instances. Add a Firestore TTL policy on
  `rateLimits.expiresAt` so expired counters are cleaned up automatically. The
  in-memory fallback only runs when Firestore is unavailable.
- `public/sw.js` never caches `/admin` or `/api` responses. Bump `CACHE_NAME`
  whenever its strategy changes.
- Only `res.cloudinary.com` is allowed through `next/image`. Upload media to
  Cloudinary rather than pasting URLs from other hosts.

## 7. Contact form

`POST /api/contact` validates the submission, applies a shared Firestore rate
limit (5 messages / 10 minutes / IP), and sends it with Nodemailer over SMTP. The
visitor's address is set as `Reply-To`. A hidden honeypot field filters basic
bots.

## Architecture

| Path                          | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `src/lib/content.ts`          | Public data access (Firestore only).                      |
| `src/lib/firebase/store.ts`   | Firestore reads/writes used by the content layer and CMS. |
| `src/lib/firebase/session.ts` | Session-cookie verification and `requireAdmin()`.         |
| `src/lib/firebase/admin.ts`   | Firebase Admin SDK singleton.                             |
| `src/lib/cloudinary.ts`       | Safe cleanup of unreferenced `portfolio/` media.          |
| `src/lib/rate-limit.ts`       | Shared Firestore contact rate limiter.                    |
| `src/lib/schemas.ts`          | Zod validation for every CMS write.                       |
| `src/app/api/admin/session`   | Exchanges an ID token for an httpOnly cookie; sign-out.   |
| `src/app/api/admin/upload`    | Signature for direct browser → Cloudinary uploads.        |
| `src/app/api/contact`         | Nodemailer contact endpoint.                              |
| `src/app/admin/(dashboard)`   | Protected CMS pages and server actions.                   |
| `src/app/(site)`              | Public pages (share the portfolio chrome).                |

Firestore layout: `profile/main`, `projects/{slug}`, `certificates/{slug}`,
`skills/{id}`, `rateLimits/{sha256(ip)}`. Documents store the same shape as the
view models in `src/lib/types.ts` plus `published` and `order`.
