export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/site-admin/:path*",
    "!/site-admin/reset-password/:path*",
  ],
};
