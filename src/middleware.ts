import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';



// Define which routes DO NOT require authentication
const isPublicRoute = createRouteMatcher(['/', "/sign-in(.*)"])


// Define which routes require authentication
const isProtectedRoute = createRouteMatcher(['/events(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Apply middleware to all routes except Next.js internals and static files
    '/((?!_next|.*\\..*|favicon.ico).*)',
  ],
};