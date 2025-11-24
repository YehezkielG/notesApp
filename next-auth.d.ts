import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      displayName?: string | null;
      bio?: string | null;
      username?: string | null;
      isOnboarded?: boolean;
      followers?: string[];
      following?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    displayName?: string | null;
    bio?: string | null;
    username?: string | null;
    isOnboarded?: boolean;
    followers?: string[];
    following?: string[];
  }
}
