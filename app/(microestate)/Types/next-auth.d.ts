// types/next-auth.d.ts or any global .d.ts file

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    role: string;
  }

  interface Session {
    user: {
      _id: string;
      email?: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    email?: string;
    role: string;
  }
}
