import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "next-auth"

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const res = await axios.post(process.env.LOGIN_URL as string, {
            email: email,
            password: password,
          });


          if (res.data && res.data.token) {
            const user: User = {
              id: res.data.id,
              email: res.data.email,
              name: res.data.fullname,
            };
            return user;
          }
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // console.log("user", user);
      // console.log("token", token);
      if(user){
        token.user = user
      }
      return token;
    },
    async session({ session, user, token }) {
      if(token && token.user) {
        session.user.id = token.user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };