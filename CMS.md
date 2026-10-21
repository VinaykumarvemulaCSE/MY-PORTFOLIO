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

Media uploads go through `/api/admin/upload`: the browser posts the file to the
server, the server signs it with the API secret, and Cloudinary returns a secure
URL. Images and PDFs up to 8 MB are accepted.

Existing project, certificate and profile images were migrated to Cloudinary
and the Firestore documents now point at `res.cloudinary.com` URLs.

PDF delivery is disabled by default on Cloudinary accounts. To upload a résumé
PDF through the dashboard, enable **Settings → Security → Allow delivery of PDF
and ZIP files**. Until then, keep the résumé at `/resume.pdf`.

## 5. Editing

- `/admin/profile` — hero, bio, education, contact, socials, site metadata.
- `/admin/projects` — create/edit/delete projects, cover + gallery images
  (drag and drop, multi-file), case study sections, demo credentials,
  publish/featured flags, ordering.
- `/admin/certificates` — certificates archive entries and their images.
- `/admin/skills` — skill groups and the icon keys the public site renders.

Every successful save shows a toast and revalidates the public routes. Unchecking
**Published** hides an item without deleting it.

## 6. Contact form

`POST /api/contact` validates the submission, applies a small in-memory rate
limit (5 messages / 10 minutes / IP), and sends it with Nodemailer over SMTP.
The visitor's address is set as `Reply-To`. A hidden honeypot field filters
basic bots.

## Architecture

| Path                          | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `src/lib/content.ts`          | Public data access (Firestore only).                      |
| `src/lib/firebase/store.ts`   | Firestore reads/writes used by the content layer and CMS. |
| `src/lib/firebase/session.ts` | Session-cookie verification and `requireAdmin()`.         |
| `src/lib/firebase/admin.ts`   | Firebase Admin SDK singleton.                             |
| `src/lib/schemas.ts`          | Zod validation for every CMS write.                       |
| `src/app/api/admin/session`   | Exchanges an ID token for an httpOnly cookie; sign-out.   |
| `src/app/api/admin/upload`    | Auth-guarded signed Cloudinary upload.                    |
| `src/app/api/contact`         | Nodemailer contact endpoint.                              |
| `src/app/admin/(dashboard)`   | Protected CMS pages and server actions.                   |
| `src/app/(site)`              | Public pages (share the portfolio chrome).                |

Firestore layout: `profile/main`, `projects/{slug}`, `certificates/{slug}`,
`skills/{id}`. Documents store the same shape as the view models in
`src/lib/types.ts` plus `published` and `order`.
