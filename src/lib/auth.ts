import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import connectToDB from "./connectToDB";
import { User } from "./models/user.model";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./validationSchemas";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    Credentials({
      authorize: async (credentials) => {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            console.log(parsedCredentials.error.flatten().fieldErrors);
            return null;
          }

          const { username, password } = parsedCredentials.data;

          await connectToDB();

          const user = await User.findOne({ username });
          if (!user) throw new Error("Wrong credentials!");

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordCorrect) throw new Error("Wrong credentials!");

          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // console.log(account, profile);
      // return true;
      if (account?.provider === "google") {
        await connectToDB();
        try {
          const user = await User.findOne({ email: profile?.email });
          if (!user) {
            await User.create({
              name: profile?.name,
              email: profile?.email,
              image: profile?.picture,
            });
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }

      if (account?.provider === "github") {
        await connectToDB();
        try {
          const user = await User.findOne({ email: profile?.email });
          if (!user) {
            await User.create({
              name: profile?.login,
              email: profile?.email,
              image: profile?.avatar_url,
            });
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token }) {
      //   console.log("token", token);
      //   return token;
      await connectToDB();
      const existingUser = await User.findOne({ email: token.email });

      if (existingUser) {
        token.id = existingUser._id.toString();
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.image = existingUser.image;
        token.isAdmin = existingUser.isAdmin;
        if (existingUser.username) {
          token.username = existingUser.username;
        } else {
          delete token.username;
        }
      }
      // console.log("token", token);
      return token;
    },
    async session({ session, token }) {
      // console.log("session", session);
      // console.log("token", token);
      // return session;
      session.user.id = token.id ?? "";
      session.user.name = token.name ?? "";
      session.user.email = token.email ?? "";
      session.user.image = token.image ?? "";
      session.user.isAdmin = token.isAdmin ?? false;
      if (token.username) {
        session.user.username = token.username ?? "";
      }
      // console.log("session", session);
      return session;
    },
  },
});
