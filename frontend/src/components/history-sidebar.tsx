import { formatDistanceToNow } from "date-fns"
import { Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { HistoryItem } from "@/lib/history"

interface HistorySidebarProps {
  history: HistoryItem[]
  onSelectItem: (item: HistoryItem) => void
  onClearHistory: () => void
}

export function HistorySidebar({ history, onSelectItem, onClearHistory }: HistorySidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">History</h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearHistory} className="h-8 px-2">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear History</span>
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {history.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <p>No history yet</p>
              <p className="text-sm">Analyzed articles will appear here</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <SidebarMenu>
                {history.map((item) => {
                  // Determine color based on score
                  const getScoreColor = () => {
                    if (item.result.score < 0.3) return "bg-green-500"
                    if (item.result.score < 0.7) return "bg-yellow-500"
                    return "bg-red-500"
                  }

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton onClick={() => { onSelectItem(item) } } className="relative pl-10">
                        <div
                          className={`absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full ${getScoreColor()}`}
                        />
                        <div className="flex flex-col items-start">
                          <span className="font-medium line-clamp-1">{item.title}</span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </ScrollArea>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
