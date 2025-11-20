import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import Google from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email' } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Attach all user fields to session.user
      session.user = { ...user };
      return session;
    },
    async signIn({ user, account }) {
      if (!account?.provider || !user?.email) return true;

      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");
      const accounts = db.collection("accounts");

      const existingUser = await users.findOne({ email: user.email });
      if (!existingUser) return true;

      const alreadyLinked = await accounts.findOne({
        userId: existingUser._id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      if (alreadyLinked) return true;

      await accounts.updateOne(
        {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
        {
          $set: {
            userId: existingUser._id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token ?? null,
            refresh_token: account.refresh_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: account.session_state ?? null,
          },
        },
        { upsert: true },
      );

      return true;
    },
  },
});
