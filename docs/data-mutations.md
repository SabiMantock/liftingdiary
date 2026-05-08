# Data Mutations

## Rule: Mutations via `/data` Helpers

All database mutations (inserts, updates, deletes) must go through helper functions in the `/data` directory. These helpers use **Drizzle ORM** exclusively.

Do NOT write raw SQL. Do NOT call the database outside of `/data` helpers.

```
src/
  data/
    workouts.ts    ← query AND mutation helpers for workouts
    exercises.ts   ← query AND mutation helpers for exercises
    ...
```

## Rule: Server Actions Only

All mutations triggered from the UI must go through **Next.js Server Actions**. Server Actions must live in colocated `actions.ts` files next to the route segment that uses them.

Do NOT mutate data via:
- Route handlers (`app/api/*/route.ts`)
- Client-side `fetch` / `axios`
- Any other mechanism

```
src/app/
  workouts/
    new/
      page.tsx       ← imports the action
      actions.ts     ← "use server" — calls /data helpers
```

## Rule: Typed Parameters — No FormData

Server Action parameters must be explicitly typed. Do NOT use `FormData` as a parameter type. Define a dedicated TypeScript type or interface for each action's arguments.

```ts
// ✅ correct
export async function createWorkout(input: CreateWorkoutInput) { ... }

// ❌ wrong
export async function createWorkout(formData: FormData) { ... }
```

## Rule: Validate All Inputs with Zod

Every Server Action must validate its arguments with **Zod** before touching the database. Never trust caller-supplied data.

1. Define a Zod schema for the action's input.
2. Call `.parse()` or `.safeParse()` at the top of the action.
3. Only proceed if validation passes.

## Rule: User Data Isolation (Critical)

Every mutation helper in `/data` must verify the authenticated user before writing. A user must never be able to mutate another user's data.

**Always:**
1. Retrieve the current session/user at the top of every helper.
2. Throw or return early if no authenticated user is found.
3. Scope writes to the authenticated user's ID (e.g. `userId: session.user.id`).

## Example

```ts
// src/data/workouts.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workouts } from "@/lib/schema";

export async function createWorkout(name: string, date: Date) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db.insert(workouts).values({
    name,
    date,
    userId: session.user.id,
  });
}
```

```ts
// src/app/workouts/new/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = CreateWorkoutSchema.parse(input);
  await createWorkout(parsed.name, parsed.date);
}
```

```tsx
// src/app/workouts/new/page.tsx  ← Client Component calls the action
"use client";

import { createWorkoutAction } from "./actions";

export default function NewWorkoutPage() {
  async function handleSubmit() {
    await createWorkoutAction({ name: "Push Day", date: new Date() });
  }
  // ...
}
```

## Rule: No `redirect()` in Server Actions

Do NOT call `redirect()` from `next/navigation` inside a Server Action. Instead, return from the action and perform the navigation client-side after the action resolves.

```ts
// ❌ wrong — redirect inside the server action
export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = CreateWorkoutSchema.parse(input);
  await createWorkout(parsed.name, parsed.date);
  redirect("/dashboard");
}
```

```ts
// ✅ correct — action just mutates, client handles navigation
export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = CreateWorkoutSchema.parse(input);
  await createWorkout(parsed.name, parsed.date);
}
```

```tsx
// ✅ correct — client component redirects after the action resolves
"use client";

import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

export default function NewWorkoutPage() {
  const router = useRouter();

  async function handleSubmit() {
    await createWorkoutAction({ name: "Push Day", date: new Date() });
    router.push("/dashboard");
  }
  // ...
}
```

## Summary

| Concern | Requirement |
|---------|-------------|
| Where to write DB mutations | `/data` helpers using Drizzle ORM |
| How to trigger mutations from UI | Server Actions in colocated `actions.ts` |
| Raw SQL | Never |
| Route handler mutations | Never |
| Client-side mutations | Never |
| Action parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod on every Server Action |
| User data isolation | Every mutation must scope writes to the authenticated user ID |
| Redirects after mutation | Client-side via `router.push()` — never `redirect()` inside a Server Action |
