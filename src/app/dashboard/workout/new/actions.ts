"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.coerce.date(),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const parsed = CreateWorkoutSchema.parse(input);
  await createWorkout(parsed.name, parsed.startedAt);
}
