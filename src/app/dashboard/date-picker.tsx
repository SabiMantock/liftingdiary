"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ selected }: { selected: Date }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(d: Date | undefined) {
    if (!d) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(d, "yyyy-MM-dd"))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">Date</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start gap-2">
            <CalendarIcon className="size-4" />
            {format(selected, "do MMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
