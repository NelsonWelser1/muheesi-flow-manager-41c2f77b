
import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: 
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: 
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: 
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        pending: 
          "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        approved:
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
        rejected:
          "border-transparent bg-rose-500 text-white hover:bg-rose-600",
        processing:
          "border-transparent bg-indigo-500 text-white hover:bg-indigo-600",
        completed:
          "border-transparent bg-teal-500 text-white hover:bg-teal-600",
        cancelled:
          "border-transparent bg-slate-500 text-white hover:bg-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<span className={cn(badgeVariants({ variant }), className)} {...props} />)
}

export { Badge, badgeVariants }
