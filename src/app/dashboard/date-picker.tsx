"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker({ selected }: { selected: Date }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSelect(d: Date | undefined) {
    if (!d) return
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", format(d, "yyyy-MM-dd"))
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      locale={enUS}
    />
  )
}
