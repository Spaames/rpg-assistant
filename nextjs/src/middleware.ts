import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

//if we go there without being logged, it will redirect.
export const config = {
    matcher: ["/", "/home", "/library", "/wishlist", "/account", "/addBookLib"],
}