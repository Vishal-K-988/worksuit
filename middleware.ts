import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";
 
const isSignInPage = createRouteMatcher(["/"]);
const isProtectedRoute = createRouteMatcher(["/user(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {

  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [
    "/((?!.*\\..*|_next).*)",
     "/",
     "/(api|trpc)(.*)"
    ],
};