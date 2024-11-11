import NextAuth, { DefaultSession, User } from "next-auth"
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        user: User
    }

    interface JWT extends DefaultJWT {
        user: {
            id: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        user: {
            id: string;
        };
    }
}