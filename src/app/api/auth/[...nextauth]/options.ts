import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAxios } from "@/utils/constants";
import { NextAuthOptions, User, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (credentials?.email && credentials.password) {
          const user = {
            id: "1", 
            password: credentials.password, 
            email: credentials.email,
          };

          try {
            
              return user;
            
          } catch (error) {
            console.error("Authorization error:", error);
            return null;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }: { token: JWT; user?: User; profile?: Profile }) {
      if (profile) {
        try {
          const checkUser = await createAxios.post("/googlegitsignin", { email: profile.email });
          if (checkUser.status === 200) {
            token = {
              ...token,
              email: profile.email,
            };
          }
        } catch (error) {
          throw new Error(`User doesn't exist: ${error}`);
        }
      }
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },
    //@ts-expect-error gfgdg
    async session({ session, token }: { session: { user: User }; token: JWT }) {
      //@ts-expect-error vdgg
      session.user = { ...token };
      return session;
    },
  },
  pages: {
    signIn: "/page/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
