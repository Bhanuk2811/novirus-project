"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

type ActionButtonProps = {
  icon: ReactNode
  title: string
  description?: string
  onClick: () => void
  isLoading?: boolean
  isActive?: boolean
  progress?: number
}

export default function ActionButton({
  icon,
  title,
  description,
  onClick,
  isLoading = false,
  isActive = false,
  progress = 0,
}: ActionButtonProps) {
  return (
    <Card
      className={cn(
        "hover-card overflow-hidden cursor-pointer transition-all duration-200",
        isActive && "border-primary/30",
        isLoading && "cursor-not-allowed",
      )}
      onClick={isLoading ? undefined : onClick}
    >
      <CardContent className="p-0">
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 h-[140px] relative overflow-hidden",
            isActive ? "bg-primary/5" : "bg-white dark:bg-gray-900",
          )}
        >
          <div className={cn("text-3xl mb-3 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
            {icon}
          </div>
          <span
            className={cn("text-base font-medium transition-colors", isActive ? "text-primary" : "text-foreground")}
          >
            {title}
          </span>

          {description && <span className="text-xs text-muted-foreground mt-1">{description}</span>}

          {isLoading && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5">
              <Progress value={progress} className="h-full rounded-none" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
