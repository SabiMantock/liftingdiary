# Authentication

## Provider: Clerk

This app uses **Clerk** exclusively for authentication. Do not implement custom auth, use NextAuth, or introduce any other authentication library.

## Getting the Current User

In Server Components and `/data` helpers, retrieve the authenticated user via Clerk's `auth()` helper:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthenticated");
```

Never use `getSession`, `getServerSession`, or any non-Clerk method to retrieve the current user.

## Protecting Routes

Use Clerk's middleware to protect routes. Configure `clerkMiddleware` in `src/middleware.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

Do not guard individual pages or layouts with manual redirect logic — rely on middleware.

## Sign In / Sign Up UI

Use Clerk's pre-built components. Do not build custom auth forms.

```tsx
import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
```

- `<SignIn />` — renders the sign-in form
- `<SignUp />` — renders the sign-up form
- `<UserButton />` — renders the user avatar/menu in the nav

## User ID in Data Helpers

Every `/data` helper that touches user-owned data must resolve the Clerk `userId` at the top and scope all queries to it. See `docs/data-fetching.md` for the full rule and examples.

```ts
import { auth } from "@clerk/nextjs/server";

export async function getWorkouts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## Summary

| Concern | Requirement |
|---------|-------------|
| Auth provider | Clerk only |
| Get current user | `auth()` from `@clerk/nextjs/server` |
| Route protection | `clerkMiddleware` in `src/middleware.ts` |
| Auth UI | Clerk pre-built components (`SignIn`, `SignUp`, `UserButton`) |
| Custom auth forms | Never |
| Other auth libraries | Never |
