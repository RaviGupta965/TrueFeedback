import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    
    // Redirect authenticated users away from auth pages
    if (token && (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up') || url.pathname.startsWith('/verify'))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow normal behavior for unauthenticated users
    return NextResponse.redirect(new URL('/home',request.url));
}

export const config = {
    matcher: [
        '/(auth)/sign-in',
        '/(auth)/sign-up',
        '/(auth)/verify/:path*',
        '/dashboard/:path*'
    ]
};
