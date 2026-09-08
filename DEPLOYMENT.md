# Deployment guide

This document describes the steps to deploy the website to Vercel and provision required provider resources (Neon/Postgres, Upstash/Redis, Stripe, S3) for production.

1) Vercel
- Dashboard → New Project → Import Git Repository → select playedout412888/website.
- Authorize the Vercel GitHub App for this repo if prompted.
- Project settings:
  - Root Directory: leave blank unless site lives in subfolder.
  - Install Command: npm ci
  - Build Command: node .v0/inject-built-with-v0.mjs && npm run build
  - Output Directory: .next
  - Node version: v18.x (set in project settings or via package.json engines)
- Add Environment Variables (Production & Preview): copy values from .env.example and fill with real secrets.

2) Neon (Postgres)
- Create a Neon project/database and copy the provided connection string.
- Add it to Vercel as DATABASE_URL.
- Run DB migrations (if using Prisma): `npx prisma migrate deploy` or `npx prisma db push` as appropriate.

3) Upstash (Redis)
- Create a Redis database and copy the connection string. Add to Vercel as REDIS_URL.

4) Stripe
- Create products and prices (Free, Pro, Business) and copy price IDs into STRIPE_PRICE_ID_* env vars.
- Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY.
- Create a webhook endpoint pointing to: https://<your-vercel-domain>/api/webhooks/stripe and copy its signing secret to STRIPE_WEBHOOK_SECRET.

5) S3 (AWS)
- Create an S3 bucket and an IAM user with programmatic access restricted to that bucket.
- Add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, and AWS_REGION to Vercel envs.

6) Background worker
- The worker can be run via `npm run worker` (local) or deployed to a background worker host.
- Ensure WORKER_SECRET (or other secrets) are set in the environment used to run the worker.

7) Testing
- Deploy the branch and open the preview URL.
- Sign up, create a project, start a job, and verify the job is queued and results stream live.
- Test Stripe checkout using test card numbers.

8) Admin
- To grant admin rights manually: `UPDATE users SET role = 'admin' WHERE email = 'you@example.com';`

9) Go live
- Add your domain in Vercel → Domains and follow DNS instructions. Vercel provisions SSL automatically.

Notes & troubleshooting
- Ensure Node version compatibility: package.json pins node 18.x.
- If builds fail due to missing env vars, add them to Vercel and re-deploy.
