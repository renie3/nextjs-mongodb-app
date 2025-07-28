declare module "next-auth" {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    username?: string | null;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image?: string | null;
      username?: string | null;
      isAdmin?: boolean;
    };
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
    isAdmin?: boolean;
  }
}
