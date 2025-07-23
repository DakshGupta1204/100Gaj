import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
  const authToken = request.cookies.get('microauthToken')?.value
  const url = new URL(request.url);

  if (authToken && url.pathname.startsWith("/microestate/auth")) {
    return NextResponse.redirect(new URL("/microestate", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/microestate/profile"],
};
