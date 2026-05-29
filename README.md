# Cloudzy.AI

Marketing website for [Cloudzy.AI](https://cloudzy.ai) — enterprise cloud infrastructure.
Built with [Astro](https://astro.build) and Tailwind CSS v4.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (hybrid SSR) |
| Styling | Tailwind CSS v4 |
| Runtime | Node.js ≥ 22 |
| Email | Nodemailer (SMTP) |
| i18n | 8 locales: `en_us`, `en_gb`, `en_au`, `en_sg`, `de_de`, `de_ch`, `nl_nl`, `ar_ae` |

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server → http://localhost:4321/ai/
npm run build     # build Node.js server to dist/
npm run preview   # preview the built server locally
```

## Running in production

The build produces a standalone Node.js server:

```bash
node dist/server/entry.mjs
```

Set `HOST` and `PORT` environment variables to control the listening address (defaults to `localhost:4321`).

## Environment variables

All SMTP variables are required for the contact form to send mail.
Set them as repository variables/secrets (GitHub Actions) and as environment variables on your server.

| Variable | Type | Description |
|---|---|---|
| `SMTP_HOST` | var | SMTP server hostname, e.g. `smtp.mailgun.org` |
| `SMTP_PORT` | var | SMTP port — `587` (STARTTLS) or `465` (TLS) |
| `SMTP_USER` | var | SMTP authentication username |
| `SMTP_FROM` | var | "From" address used in outgoing mail, e.g. `noreply@cloudzy.ai` |
| `SMTP_REPLY` | var | Recipient address for contact form submissions, e.g. `hello@cloudzy.ai` |
| `SMTP_PASS` | **secret** | SMTP password — store as a repository secret, never a plain variable |

### Local development

Create a `.env` file in the project root (it is git-ignored):

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_FROM=noreply@cloudzy.ai
SMTP_REPLY=hello@cloudzy.ai
SMTP_PASS=your-smtp-password
```

### GitHub Actions

1. Go to **Settings → Secrets and variables → Actions**
2. Under **Variables**, add: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_FROM`, `SMTP_REPLY`
3. Under **Secrets**, add: `SMTP_PASS`

The CI workflow (`deploy.yml`) passes these to `npm run build` and uploads the built server as an artifact named `cloudzy-server`. Add your own deployment step to push `dist/` to your server.

## Project structure

```
src/
├── components/
│   ├── contact/ContactPage.astro   # contact page with SMTP form
│   └── ...
├── i18n/
│   ├── config.ts                   # locale definitions
│   ├── utils.ts                    # t(), tArray(), getLocalizedPath()
│   └── translations/               # one JSON file per locale
├── pages/
│   ├── api/contact.ts              # POST endpoint — sends mail via SMTP
│   └── [locale]/contact.astro
public/
└── images/
```

## Contact form API

`POST /ai/api/contact`

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Cloud inquiry",
  "message": "Hello, I'd like to know more about..."
}
```

Returns `{ "success": true }` on success, or `{ "error": "..." }` with a 4xx/5xx status on failure.
Submitted mail arrives at `SMTP_REPLY` with `Reply-To` set to the sender's address.
