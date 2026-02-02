import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // public reset password route allowed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow reset password without login
        if (pathname.startsWith("/site-admin/reset-password")) {
          return true;
        }
        // Protect everything else under site-admin
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/site-admin/:path*"],
};
