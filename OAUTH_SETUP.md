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

## Step 6: Run and Authenticate

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
