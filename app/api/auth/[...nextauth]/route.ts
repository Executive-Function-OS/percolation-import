import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
  secret: process.env.NEXTAUTH_SECRET ?? "unsecure_default_secret_for_development_xyz789",
});

export { handler as GET, handler as POST };
