import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                    const res = await fetch(`${process.env.BACKEND_URL}/users/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const user = await res.json();

                    if (!res.ok || !user) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        token: user.token,
                    };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await fetch(`${process.env.BACKEND_URL}/users/loginWithGoogle`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        googleId: profile?.sub, // Google user ID
                    }),
                });
                return true; // allow sign in
            } catch (err) {
                console.error("Error registering user:", err);
                return false; // reject sign in if backend fails
            }
        },
    },
});

export { handler as GET, handler as POST };