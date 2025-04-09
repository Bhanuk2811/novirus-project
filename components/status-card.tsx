import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

type StatusCardProps = {
  icon: ReactNode
  title: string
  status: string
  statusColor: "green" | "red" | "yellow"
  description?: string
}

export default function StatusCard({ icon, title, status, statusColor, description }: StatusCardProps) {
  return (
    <Card className="hover-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "p-3 rounded-full",
                statusColor === "green" && "bg-success/10",
                statusColor === "red" && "bg-destructive/10",
                statusColor === "yellow" && "bg-amber-500/10",
              )}
            >
              <div
                className={cn(
                  "text-2xl",
                  statusColor === "green" && "text-success",
                  statusColor === "red" && "text-destructive",
                  statusColor === "yellow" && "text-amber-500",
                )}
              >
                {icon}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>

          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-2",
              statusColor === "green" && "bg-success/10 text-success",
              statusColor === "red" && "bg-destructive/10 text-destructive",
              statusColor === "yellow" && "bg-amber-500/10 text-amber-600",
            )}
          >
            <span
              className={cn(
                "status-indicator",
                statusColor === "green" && "connected",
                statusColor === "red" && "disconnected",
                statusColor === "yellow" && "connecting",
              )}
            />
            <span>{status}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
