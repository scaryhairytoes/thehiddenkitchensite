# The Hidden Kitchen 

A modern, full-stack web application for "The Hidden Kitchen" restaurant. This platform is built with **Next.js** for a dynamic, highly interactive frontend and powered by **Payload CMS** for a robust, integrated backend.

The website provides several core features for the restaurant:
- **Table Reservations:** Form for users to book standard tables.
- **Stage Booking:** Custom request form for booking the venue's stage.
- **Career Applications:** Job application form with resume file uploads.
- **Contact Forms:** Secure routing of inquiries to the appropriate restaurant departments.

---

## 🏗 Project Overview & Architecture

This project uses the **Next.js + Payload CMS** combined architecture. The CMS and frontend are housed within the same Next.js application, utilizing Payload's Next.js beta adapters. 
Forms on the frontend communicate with custom Next.js API routes, which perform security checks and then securely create records in Payload CMS via the Local API.

## 🚀 Tech Stack & Dependencies

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **CMS / Backend:** [Payload CMS 3.0](https://payloadcms.com/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/) & [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [tw-animate-css](https://github.com/morteza-asadzadi/tw-animate-css)
- **Database:** [Turso / libSQL](https://turso.tech/) (via `@payloadcms/db-sqlite`)
- **Email Service:** [Resend](https://resend.com/) (via `@payloadcms/email-resend`)
- **Spam Protection:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (via `@marsidev/react-turnstile`)
- **File Storage:** AWS S3 compatible object storage (via `@payloadcms/storage-s3`)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🔑 Environment Variables

To run this project locally or deploy it to Vercel, you will need the following environment variables. In Vercel, these should be added to the Project Settings.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | The libSQL connection string (e.g., Turso DB URL) used by Payload to connect to the database. |
| `PAYLOAD_SECRET` | A secure, random string used by Payload CMS to encrypt JWTs and internal data. |
| `RESEND_API_KEY` | API key from your Resend account to dispatch transactional emails. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | The public site key for Cloudflare Turnstile, used in frontend forms. |
| `TURNSTILE_SECRET_KEY` | The private secret key for Cloudflare Turnstile, used in API routes for server-side validation. |
| `NEXT_PUBLIC_SERVER_URL` | The public URL of the application (e.g., `http://localhost:3000` or `https://your-domain.com`). |
| `S3_BUCKET` | The name of the S3 bucket where file uploads (e.g., resumes) are stored. |
| `S3_ACCESS_KEY_ID` | Access key ID for the S3-compatible storage. |
| `S3_SECRET_ACCESS_KEY` | Secret access key for the S3-compatible storage. |
| `S3_REGION` | The region of your S3 bucket (use `auto` for Cloudflare R2). |
| `S3_ENDPOINT` | The endpoint URL for your S3 provider (e.g., AWS, Cloudflare R2, DigitalOcean Spaces). |

---

## 📁 Project Structure

```text
├── app/
│   ├── (app)/                   # Frontend Next.js Pages
│   │   ├── book-the-stage/      # Stage Booking Page
│   │   ├── careers/             # Careers Page
│   │   └── reservations/        # Table Reservations Page
│   ├── (payload)/               # Payload CMS Admin Panel Routes
│   └── api/                     # Custom Next.js API Routes (Form Handlers)
│       ├── submit-career-application/
│       ├── submit-reservation/
│       └── submit-stage-request/
├── components/                  # Reusable React UI Components (shadcn, etc.)
├── media/                       # Local media assets
├── lib/                         # Utility functions (e.g., utils.ts for tailwind)
├── payload.config.ts            # Core Payload CMS configuration and collections
├── package.json                 # Project dependencies and scripts
└── globals.css                  # Global Tailwind CSS and variables
```

---

## 🛡️ Security & Form Architecture

### 1. Form Submission Flow & Spam Protection
All public-facing forms (Careers, Reservations, Stage Booking) are protected by **Cloudflare Turnstile**. 
When a user submits a form:
1. The frontend generates a Turnstile token.
2. The form data and token are sent to a specific Next.js API route (`app/api/...`).
3. The API route verifies the token securely with Cloudflare using `TURNSTILE_SECRET_KEY`.
4. If the validation fails or the token is invalid, the request is immediately rejected.

### 2. Payload CMS Collection Access Controls
To prevent unauthorized users from hitting the Payload REST/GraphQL APIs directly to spam the database, the collections (e.g., `Reservations`, `StageRequests`, `CareerApplications`) have restricted access controls:
```typescript
access: {
  create: () => false, // Prevents external API creation
  // ...
}
```
Records can only be created via the protected Next.js API routes using Payload's `Local API` (`getPayload()`), which bypasses standard access control checks on the server side.

### 3. Email Dispatching
Emails are dispatched using the official `@payloadcms/email-resend` adapter. 
Upon successful form submission (via Payload Collection hooks or the API routes directly), emails are sent to specific hardcoded recipient departments:
- **Events:** `events@...` (for Stage Booking requests)
- **Careers:** `careers@...` (for Job Applications)
- **Reservations:** `reservations@...` (for Table Reservations)

---

## 💻 Development & Deployment Workflow

### Local Development Setup

1. Clone the repository and install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```
2. Create a `.env` file in the root directory based on the Environment Variables listed above.
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Access the frontend at `http://localhost:3000` and the Payload Admin panel at `http://localhost:3000/admin`.

### Building for Production

To build the Next.js application (including the Payload admin UI):
```bash
pnpm build
```

### Deployment Flow

The project is configured for continuous deployment on **Vercel**.
1. Ensure all environment variables are correctly set in the Vercel Project Settings.
2. The deployment pipeline is triggered automatically whenever code is pushed or merged into the `main` branch on GitHub.
3. Vercel will install dependencies (`pnpm install`), build the app (`pnpm build`), and deploy the integrated Next.js/Payload application.
