import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email });
          console.log("user...", credentials);

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("Please sign in with Google");
          }

          const isValid = await user.comparePassword(credentials.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            phone: user.phone,
            tier: user.tier,
            updatedAt: user.updatedAt,
            resetPasswordExpire: user.resetPasswordExpire,
            permissions: user.permissions,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser && account.provider === "google") {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId,
          });
        }

        return true;
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },

    // 🔑 FIXED JWT CALLBACK
    async jwt({ token, user, trigger, session, account }) {
      await connectDB();
      // Initial login
      if (user) {
        token.id = user.id || user._id?.toString();
        token.role = user.role || token.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.phone = user.phone;
        token.tier = user.tier;
        token.updatedAt = user.updatedAt;
        token.resetPasswordExpire = user.resetPasswordExpire;
        token.permissions = user.permissions;
      }

      // // 🔥 ALWAYS hydrate DB fields for Google users
      // if (token.email) {
      //   const dbUser = await User.findOne({ email: token.email });

      //   if (dbUser) {
      //     token.id = dbUser._id.toString();
      //     token.role = dbUser.role;
      //     token.tier = dbUser.tier; // ✅ FIXED
      //     token.phone = dbUser.phone;
      //     token.permissions = dbUser.permissions;
      //     token.updatedAt = dbUser.updatedAt;
      //     token.resetPasswordExpire = dbUser.resetPasswordExpire;
      //   }
      // }

      // ✅ THIS is the missing part (runtime updates)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.phone = session.user.phone;
        token.image = session.user.image;
        token.tier = session.user.tier;
        token.updatedAt = session.user.updatedAt;
        token.resetPasswordExpire = session.user.resetPasswordExpire;
        token.permissions = session.user.permissions; // ✅ keep in sync
      }

      return token;
    },

    // ✅ Session built ONLY from token (fast + correct)
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.phone = token.phone;
      session.user.tier = token.tier;
      session.user.image = token.image;
      session.user.permissions = token.permissions;
      session.user.updatedAt = token.updatedAt;
      session.user.resetPasswordExpire = token.resetPasswordExpire;
      session.user.role = token.role;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
