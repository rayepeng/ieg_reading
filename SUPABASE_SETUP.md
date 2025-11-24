# Supabase & Vercel Setup Guide

## Environment Variables

When deploying to Vercel with Supabase, you need to configure the following environment variables in your Vercel project settings.

### Database Connection (Supabase)

These values can be found in your Supabase project settings under **Project Settings > Database > Connection parameters**.

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | The connection string for the Transaction Pooler (port 6543). Required for serverless environments like Vercel. | `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | The direct connection string to the database (port 5432). Used by Prisma for migrations. | `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres` |

> [!IMPORTANT]
> Make sure to append `?pgbouncer=true` to the `DATABASE_URL` if you are using the transaction pooler.

### Authentication (NextAuth)

| Variable | Description | Generation |
| :--- | :--- | :--- |
| `NEXTAUTH_URL` | The canonical URL of your site. | `https://your-project.vercel.app` (Production) or `http://localhost:3000` (Local) |
| `NEXTAUTH_SECRET` | A random string used to hash tokens and sign cookies. **Critical for security.** | Run `openssl rand -base64 32` in your terminal to generate one. |

## Fix for "JWEDecryptionFailed"

If you encounter the `JWEDecryptionFailed` error, it usually means:
1.  `NEXTAUTH_SECRET` is missing or has changed.
2.  There are old cookies encrypted with a different secret.

**Solution:**
1.  Ensure `NEXTAUTH_SECRET` is set in your `.env` (local) or Vercel Environment Variables.
2.  **Clear your browser cookies** for the site (specifically `next-auth.session-token`).
3.  Restart your application.

## Local Development

1.  Copy `.env.example` to `.env`.
2.  Fill in your Supabase credentials.
3.  Generate a `NEXTAUTH_SECRET`.
4.  Run `npx prisma generate` to update the client.
5.  Run `npx prisma db push` to sync the schema with your remote Supabase database.
