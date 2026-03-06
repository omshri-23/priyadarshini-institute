# Priyadarshini Computer & Typewriting Institute, Shirol

React + Vite website for Priyadarshini Computer & Typewriting Institute, Shirol with:

- Vercel serverless APIs
- Supabase database storage
- admin-editable site settings
- generated student IDs
- PDF receipt download after admission enquiry

## Local development

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

For the registration API locally, use `vercel dev` after setting `.env.local`.

## Deploy

This project is prepared for Vercel deployment with Supabase storage for student registrations.

### Vercel

1. Create a Supabase project.
2. Open the SQL editor and run [schema.sql](C:\Users\Lenovo\priyadarshini-institute\supabase\schema.sql).
   If you already created the old table earlier, run this latest schema so `student_code` and `site_settings` exist.
3. In Supabase project settings, copy:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Set admin credentials too:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
5. Copy `.env.example` to `.env.local` and fill those values for local/serverless testing.
6. Push this project to GitHub.
7. Import the repo into Vercel.
8. In Vercel project settings, add these environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
9. Deploy.

## Admin usage

1. Open the live website with `?admin=1` added to the URL.
   Example: `https://your-site.vercel.app/?admin=1`
3. Log in using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
4. In the dashboard you can:
   - view all enquiries
   - view all contact messages
   - open full enquiry details
   - change payment status
   - delete enquiries
   - mark messages as done/new
   - update WhatsApp, UPI, name, phone, and address settings

## Student flow

1. Student fills the admission form.
2. The form is saved in Supabase.
3. A student ID like `PCTI-2026-0001` is generated.
4. A PDF receipt is downloaded automatically.

### Exact commands

```bash
cd C:\Users\Lenovo\priyadarshini-institute
git init
git add .
git commit -m "Initial Vercel-ready institute site"
```

Then create a GitHub repo and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/priyadarshini-institute.git
git branch -M main
git push -u origin main
```

If you want to deploy with the Vercel CLI instead of importing on the website:

```bash
npm i -g vercel
vercel
vercel --prod
```

### Vercel settings

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
