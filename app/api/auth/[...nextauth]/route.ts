import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomBytes } from "crypto";

// NEXTAUTH_SECRET signs session JWTs (including the Google accessToken they
// carry). The previous fallback was a fixed string checked into this public
// repo, so any deployment that forgot to set the real secret was signing
// sessions with a value anyone could read on GitHub. Falling back to a
// per-boot random value instead means a missing secret fails safely (logged
//-out users after a restart) rather than silently insecurely.
if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "[auth] NEXTAUTH_SECRET is not set. Using a random per-process secret — " +
      "sessions will not persist across restarts and will break across " +
      "multiple server instances. Set NEXTAUTH_SECRET in your deployment " +
      "environment (generate one with `openssl rand -base64 32`)."
  );
}
const devFallbackSecret = randomBytes(32).toString("hex");

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/drive.activity.readonly",
        },
      },
    }),
    CredentialsProvider({
      id: "developer-login",
      name: "Developer Sandbox (No Google Required)",
      credentials: {
        password: { label: "Sandbox Password (type 'admin')", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === "admin") {
          return { id: "dev-sandbox-1", name: "Developer", email: "dev@example.com", isMock: true };
        }
        return null; // Reject login if password is not "admin"
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        // Only set for Google
        if (account.provider === "google") {
          token.accessToken = account.access_token;
        }
      }
      // If user comes from Credentials provider, mark them as mock
      if (user) {
        token.isMock = (user as any).isMock ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose these custom properties to the client
      (session as any).accessToken = token.accessToken as string | undefined;
      (session as any).isMock = token.isMock as boolean | undefined;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? devFallbackSecret,
});

export { handler as GET, handler as POST };
