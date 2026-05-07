# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do not create custom components. Every UI element — buttons, inputs, dialogs, cards, tables, badges, etc. — must come from the shadcn/ui library. If a shadcn/ui component does not exist for a use case, install the closest available component and compose from it rather than building something from scratch.

Install new components via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are added to `src/components/ui/` and can be imported from there:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Date Formatting

All dates must be formatted using `date-fns`. Do not use `toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.

Dates must be displayed with an ordinal day suffix, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the `do MMM yyyy` format token with `format` from `date-fns`:

```ts
import { format } from "date-fns"

format(new Date("2025-09-01"), "do MMM yyyy") // "1st Sep 2025"
format(new Date("2026-01-03"), "do MMM yyyy") // "3rd Jan 2026"
```
