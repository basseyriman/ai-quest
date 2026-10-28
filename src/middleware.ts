import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_CREATOR_PREFIXES = [
  "/print-cards",
  "/print-box",
  "/print-manual",
  "/print-scorecard",
  "/print-feedback-qr",
  "/print-playtest-poster",
  "/print",
  "/box-render",
  "/cards",
  "/api/print",
];

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const isCreatorRoute = PROTECTED_CREATOR_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isCreatorRoute) {
    return NextResponse.next();
  }

  // Allow creator access via secret query param (?creator=rimanstech) or cookie
  const creatorKey = searchParams.get("creator");
  const hasCreatorCookie = request.cookies.get("aiquest_creator")?.value === "authorized";

  if (creatorKey === "rimanstech") {
    const response = NextResponse.next();
    response.cookies.set("aiquest_creator", "authorized", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  if (hasCreatorCookie) {
    return NextResponse.next();
  }

  // Block public access to creator/factory print routes — redirect to public homepage
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/print-cards",
    "/print-cards/:path*",
    "/print-box",
    "/print-box/:path*",
    "/print-manual",
    "/print-manual/:path*",
    "/print-scorecard",
    "/print-scorecard/:path*",
    "/print-feedback-qr",
    "/print-feedback-qr/:path*",
    "/print-playtest-poster",
    "/print-playtest-poster/:path*",
    "/print",
    "/print/:path*",
    "/box-render",
    "/box-render/:path*",
    "/cards",
    "/cards/:path*",
    "/api/print/:path*",
  ],
};
