# Google OAuth 2.0 Setup Guide for EFOS

This guide explains how to configure your own Google Cloud Project and OAuth credentials to allow the EFOS Analysis Engine to retrieve your retrospective Google Drive activity logs locally.

All data remains strictly on your device. The OAuth token is only used by your local browser to query the Google API directly.

---

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with the Google Account containing the Drive data you want to analyze.
3. Click the project dropdown in the top navigation bar and select **New Project**.
4. Name the project `Executive Function OS` (or any name you prefer) and click **Create**.

---

## Step 2: Enable the Drive Activity API

1. In the top search bar of the Cloud Console, search for **Google Drive Activity API**.
2. Select it from the results and click **Enable**.

---

## Step 3: Configure the OAuth Consent Screen

Because your application is running locally and has not been verified by Google, you must configure it as an internal/testing application and add your email as a test user.

1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select **User Type: External** and click **Create**.
3. Under **App information**:
   * **App name:** `Executive Function OS`
   * **User support email:** Select your email address.
4. Scroll to the bottom and set **Developer contact information** to your email address, then click **Save and Continue**.
5. In the **Scopes** step:
   * Click **Add or Remove Scopes**.
   * In the bottom manually add scope input, paste:
     `https://www.googleapis.com/auth/drive.activity.readonly`
   * Click **Add to Table** and then **Update**.
   * Click **Save and Continue**.
6. In the **Test users** step (**CRITICAL STEP**):
   * Click **Add Users**.
   * Enter your Google email address (the same one you will sign in with). *If you omit this, Google will block your login with a `Developer Error`.*
   * Click **Save and Continue** and then **Back to Dashboard**.

---

## Step 4: Create OAuth 2.0 Credentials

1. In the left sidebar, click **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `EFOS Local Host`.
5. Under **Authorized JavaScript origins**:
   * Click **+ Add URI** and enter: `http://localhost:3000`
6. Under **Authorized redirect URIs** (**CRITICAL STEP**):
   * Click **+ Add URI** and enter the NextAuth callback url:
     `http://localhost:3000/api/auth/callback/google`
7. Click **Create**.
8. A modal will pop up displaying your **Client ID** and **Client Secret**. Copy these values.

---

## Step 5: Configure your `.env.local`

1. Open `/home/annika/percolation-import/.env.local` in your editor.
2. Replace the default values with your new credentials:
   ```env
   # Google OAuth Client ID used by the client-side app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_copied_client_id.apps.googleusercontent.com

   # NextAuth Backend settings (ID must match the client-side ID)
   GOOGLE_ID=your_copied_client_id.apps.googleusercontent.com

   # Secret Key retrieved from Google Credentials page
   GOOGLE_SECRET=your_copied_client_secret
   ```
3. Save the file.

---

## Step 6: Run and Authenticate (Local Dev)

1. In your terminal, restart the Next.js development server:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:3000/engine](http://localhost:3000/engine).
3. Check the **Tiered Consent** box to agree to processing, and click **Sign in to connect**.
4. Choose **Sign in with Google**.
5. *Google will display a warning screen stating that the app is unverified. Click **Advanced** > **Go to Executive Function OS (unsafe)** to proceed.*
6. Grant read-only access to your Drive Activity logs.
7. You are now logged in! Click **Extract network data** to process your actual Google Drive history.

> **Don't want to set up a Google Cloud project at all?** `/quick-start` runs the
> same DBSCAN + percolation pipeline entirely client-side against an uploaded
> RescueTime-style CSV, or a bundled demo dataset — no OAuth required. On
> `/engine`, "Developer Sandbox" (password `admin`, listed on the sign-in
> screen) and "View sample results" also work with zero configuration.

---

## Production Deployment (e.g. demo.executivefunctionos.com)

The steps above configure OAuth for `localhost:3000` only. A deployed
instance needs its own authorized origin/redirect URI on the **same or a
separate** OAuth client, plus production environment variables — Google
callback URLs and `NEXTAUTH_URL` are exact-match, so mixing dev and prod
values here is the most common cause of a broken production sign-in.

### 1. Add the production origin in Google Cloud Console

On the OAuth client from Step 4 (or a new one dedicated to production):

- **Authorized JavaScript origins:** add `https://demo.executivefunctionos.com`
- **Authorized redirect URIs:** add
  `https://demo.executivefunctionos.com/api/auth/callback/google`

### 2. Set environment variables on your host (e.g. Vercel → Project → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `GOOGLE_ID` | Same Client ID from Step 4 |
| `GOOGLE_SECRET` | Same Client Secret from Step 4 |
| `NEXTAUTH_URL` | `https://demo.executivefunctionos.com` |
| `NEXTAUTH_SECRET` | A real random secret — generate with `openssl rand -base64 32`. **Required in production**: without it, sessions are signed with a value regenerated on every server restart, which logs everyone out and breaks across multiple server instances. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Same Client ID (cosmetic only — shown in the UI, doesn't gate the OAuth flow itself) |

`NEXTAUTH_URL` in particular is easy to miss: without it, NextAuth silently
falls back to `http://localhost:3000` for its callback URLs even when
running on a real domain, which breaks the redirect after Google sign-in.

### 3. Who can actually sign in

While the OAuth consent screen's **Publishing status** is **Testing** (the
default for a new project), only the up-to-100 accounts listed under **Test
users** (Step 3 above) can complete sign-in — everyone else gets a
"this app is blocked" error before they ever reach the unverified-app
warning. To let it out:

- **Just you (and a few named testers):** add each Google account under
  **Test users**. Takes a minute, no waiting, works immediately.
- **Any visitor:** requires submitting the app for
  [Google's OAuth verification](https://support.google.com/cloud/answer/13463073)
  — a review of the requested scope (`drive.activity.readonly`, considered
  sensitive) that typically takes days to weeks and requires a public privacy
  policy URL (this repo has one at `/privacy`) and homepage. This is an
  external Google process, not something fixable by changing code — plan for
  it separately and keep using Testing mode with test users in the meantime.
