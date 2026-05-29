import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'next-auth.session-token',
  });

  if (!token) {
    const signInUrl = new URL('/login', req.url);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/practice/:path*",
    "/chat",
    "/chat/:path*",
    "/progress/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/exam/:path*",
  ],
};
