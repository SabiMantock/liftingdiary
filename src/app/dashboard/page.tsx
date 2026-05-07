import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "./date-picker"
import { getWorkoutsForDate } from "@/data/workouts"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date: dateParam } = await searchParams
  const date = dateParam ? parseISO(dateParam) : new Date()
  const workouts = await getWorkoutsForDate(date)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      <DatePicker selected={date} />

      <div className="space-y-3">
        <h2 className="text-lg font-medium">
          Workouts logged for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{workout.name ?? "Unnamed Workout"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {workout.exercises.map((exercise) => (
                  <div key={exercise.id}>
                    <p className="text-sm font-medium">{exercise.name}</p>
                    <ul className="text-sm text-muted-foreground">
                      {exercise.sets.map((set) => (
                        <li key={set.id}>
                          Set {set.setNumber}: {set.reps ?? "—"} reps
                          {set.weightKg ? ` @ ${set.weightKg}kg` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
