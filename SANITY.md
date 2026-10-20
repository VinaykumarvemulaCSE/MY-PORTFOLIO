# Sanity setup

The site works right now — it reads `public/data/*.json`. Sanity takes over the
moment `SANITY_PROJECT_ID` is set. Nothing breaks in between, which is why this
can be done in stages.

## 1. Create the project (2 minutes)

1. Go to <https://manage.sanity.io> and sign in with GitHub or Google.
2. **Create project** → name it `vinay-portfolio`.
3. Dataset name: `production`. Leave the dataset **public** (the free plan only
   allows public datasets — see the note at the end).
4. Copy the **Project ID** from the project dashboard.

## 2. Add the environment variables

Create `.env.local` in the repo root (it is gitignored):

```bash
SANITY_PROJECT_ID=xxxxxxxx      # from step 1
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01

# Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SANITY_REVALIDATE_SECRET=some-long-random-string
```

And `studio/.env` (also gitignored):

```bash
SANITY_STUDIO_PROJECT_ID=xxxxxxxx
SANITY_STUDIO_DATASET=production
```

Restart `npm run dev` afterwards — Next only reads env files at boot.

## 3. Open the Studio

```bash
npm run studio          # http://localhost:3333
```

The first launch asks you to log in to Sanity. Your schemas are already there:
**Profile**, **Site settings**, **Projects**, **Certificates**.

Profile and Site settings are singletons — there is exactly one of each and you
cannot accidentally create a second one.

## 4. Import the existing content

```bash
npm run migrate:sanity
```

This writes `sanity-export/*.ndjson` (gitignored). Then:

```bash
npx sanity dataset import sanity-export/profile.ndjson production --replace
npx sanity dataset import sanity-export/siteSettings.ndjson production --replace
npx sanity dataset import sanity-export/projects.ndjson production
npx sanity dataset import sanity-export/certificates.ndjson production
```

`--replace` on the two singletons is deliberate: re-running the import should
overwrite them, not create duplicates.

**Images are not imported.** You need to drag them into the Studio by hand. The
screenshots currently live in `public/`; once they are uploaded, Sanity serves
them from `cdn.sanity.io` and the `public/` copies can be deleted.

## 5. Point the site at Sanity

With the env vars set, `npm run dev` now reads from Sanity. Check:

- the home page shows your real profile
- `http://localhost:3000/api/revalidate?secret=<your-secret>` returns
  `{"revalidated":true,...}`

## 6. Webhook (so edits appear without a redeploy)

In <https://manage.sanity.io> → your project → **API** → **Webhooks** → Create:

| Field     | Value                                                        |
| --------- | ------------------------------------------------------------ |
| Name      | Revalidate portfolio                                         |
| URL       | `https://vinaykumar.eu.cc/api/revalidate?secret=<SECRET>`      |
| Dataset   | `production`                                                 |
| Trigger on | Create, Update, Delete                                      |
| Filter    | `_type in ["project","profile","certificate","siteSettings"]` |
| Projection| `{"_type": _type}`                                            |

`SECRET` must be identical to `SANITY_REVALIDATE_SECRET`.

All Sanity reads share one cache tag (`sanity`), so a single webhook call
invalidates everything. On a portfolio that is the right trade-off: no
per-document bookkeeping, and nobody notices that unrelated pages also
refreshed.

## 7. Deploy the Studio (optional but recommended)

```bash
npm run studio:deploy
```

Pick a hostname (e.g. `vinaykumar`) and set it in `studio/.env`:

```bash
SANITY_STUDIO_HOST=vinaykumar
```

The Studio is then editable from any device at
`https://vinaykumar.sanity.studio` — no local checkout needed.

## Why the Studio is a separate app

Sanity v6 requires React 19.2+. This site runs React 18.3.1, and forcing a React
upgrade in the middle of a redesign would risk the whole live site.

So `studio/` has its own `package.json`, its own `node_modules` and its own React
19. The public site only depends on `@sanity/client` and `@sanity/image-url`,
neither of which has a React peer dependency. Bonus: none of the Studio's ~2 MB
of UI code can leak into the public bundle.

`studio/` is excluded from the root `tsconfig.json` and ESLint config.

## Security note about the free plan

Free-plan datasets are **public**: anyone with your project ID can read
published documents. That is fine for a portfolio.

It is **not** fine for contact form submissions. Those are sent by email through
Resend and are never written to Sanity — keep it that way.

## Publishing a certificate without opening the Studio

Certificates use the same fallback rule as projects: Sanity wins as soon as the
dataset contains at least one `certificate` document, otherwise
`public/data/certificates.json` is used. That means you can ship the NPTEL
credential today, before the Sanity import.

1. Put the certificate scan in `public/certificates/` (for example
   `nptel-cloud-computing.jpg`). A 1600px-wide JPG or PNG keeps the modal sharp
   without making the page heavy.
2. Add an entry to `public/data/certificates.json`:

```json
[
  {
    "id": "nptel-cloud-computing",
    "slug": "nptel-cloud-computing",
    "title": "Cloud Computing",
    "issuer": "NPTEL",
    "awardedBy": "IIT Kharagpur",
    "grade": "Elite",
    "score": "84%",
    "duration": "12 weeks",
    "issueDate": "2026-10-15",
    "credentialId": "NPTEL26CS000000000",
    "verifyUrl": "https://archive.nptel.ac.in/content/...",
    "category": "Course",
    "summary": "One or two sentences about what the course covered.",
    "skills": ["Cloud Computing", "Virtualisation", "Distributed Systems"],
    "image": "/certificates/nptel-cloud-computing.jpg",
    "featured": true
  }
]
```

Only include fields you can prove. If the score or credential ID is unknown,
delete those keys rather than guessing: the card and the detail page hide
missing fields, and a wrong score is worse than no score.

The section appears at `/#certificates`, and each entry gets a static,
verifiable page at `/certificates/<slug>` that is added to the sitemap
automatically.
