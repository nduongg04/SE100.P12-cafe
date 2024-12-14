import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const baseURL = process.env.BASE_URL;
    const refreshToken = req.cookies.get("refreshToken");
    if (
        refreshToken == undefined ||
        refreshToken == null ||
        refreshToken.value == ""
    ) {
        console.log("hello");
        const url = new URL("/login", req.nextUrl.origin);
        return Response.redirect(url);
    }
    const response = await fetch(`${baseURL}/auth/check-token`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${refreshToken.value}`,
        },
    });

    if (!response.ok) {
        console.log("no oke");
        return Response.redirect(new URL("/login", req.nextUrl.origin));
    }

    NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/", "/employee/:path*"],
};
