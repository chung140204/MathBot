import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/chat/:path*",
    "/progress/:path*",
  ],
};
