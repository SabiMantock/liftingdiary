"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createWorkoutAction, type CreateWorkoutInput } from "./actions";

const schema = z.object({
  name: z.string().min(1, "Workout name is required"),
  startedAt: z.date({ error: "Date is required" }),
});

export default function NewWorkoutPage() {
  const router = useRouter();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkoutInput>({
    resolver: zodResolver(schema),
    defaultValues: { startedAt: new Date() },
  });

  const startedAt = watch("startedAt");

  async function onSubmit(data: CreateWorkoutInput) {
    await createWorkoutAction(data);
    router.push("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Workout name</Label>
              <Input
                id="name"
                placeholder="e.g. Push Day"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startedAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startedAt
                      ? format(startedAt, "do MMM yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startedAt}
                    onSelect={(d) => {
                      if (d) {
                        setValue("startedAt", d, { shouldValidate: true });
                        setCalendarOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.startedAt && (
                <p className="text-sm text-red-500">{errors.startedAt.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Create Workout"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
