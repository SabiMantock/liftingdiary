# Data Fetching

## Rule: Server Components Only

ALL data fetching must be done exclusively via **React Server Components**.

Do NOT fetch data via:
- Route handlers (`app/api/*/route.ts`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side fetching library

If a component needs data, it must be a Server Component (no `"use client"` directive) that `await`s a helper function from the `/data` directory.

## Rule: Database Queries via `/data` Helpers

All database queries must go through helper functions located in the `/data` directory. These helpers use **Drizzle ORM** exclusively.

Do NOT write raw SQL. Do NOT query the database outside of `/data` helpers.

```
src/
  data/
    workouts.ts    ← helper functions for workout queries
    exercises.ts   ← helper functions for exercise queries
    ...
```

Each helper function should be imported directly into a Server Component and `await`ed.

## Rule: User Data Isolation (Critical)

Every query that returns user-owned data **must** filter by the authenticated user's ID. A logged-in user must never be able to access another user's data.

**Always:**
1. Retrieve the current session/user at the top of every helper function.
2. Throw or return early if no authenticated user is found.
3. Include `where: eq(table.userId, userId)` (or equivalent) on every query.

### Example

```ts
// src/data/workouts.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

```tsx
// src/app/dashboard/page.tsx  ← Server Component (no "use client")
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts();
  return <WorkoutList workouts={workouts} />;
}
```

## Summary

| Concern | Requirement |
|---------|-------------|
| Where to fetch data | Server Components only |
| How to query the DB | Drizzle ORM via `/data` helpers |
| Raw SQL | Never |
| Route handler data fetching | Never |
| Client-side data fetching | Never |
| User data isolation | Every query must filter by authenticated user ID |
