import { NextResponse } from "next/server";
export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";
export async function middleware(request) {
    var _a;
    //   const token = await getToken({ req: request });
    const authToken = (_a = request.cookies.get('microauthToken')) === null || _a === void 0 ? void 0 : _a.value;
    const url = new URL(request.url);
    if (authToken && url.pathname.startsWith("/microestate/auth")) {
        return NextResponse.redirect(new URL("/microestate", request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/microestate/profile"],
};
