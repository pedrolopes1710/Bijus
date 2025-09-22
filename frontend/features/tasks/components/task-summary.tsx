import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Calendar, Filter, MoreHorizontal, Plus } from "lucide-react"

export default function TaskSummary() {
  const tasks = [
    {
      id: 1,
      title: "Exemplo",
      project: "Website Redesign",
      priority: "High",
      dataInicio:"2025-05-15",
      dataFim: "2025-05-20",
      assignee: {
        name: "Alex ",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-700 hover:bg-red-500/30"
      case "Medium":
        return "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30"
      case "Low":
        return "bg-green-500/20 text-green-700 hover:bg-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30"
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        <div className="divide-y">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center p-4 hover:bg-muted/50">
              <Checkbox id={`task-${task.id}`} className="mr-4" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-muted-foreground">{task.project}</div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(task.dataInicio).toLocaleDateString()}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuItem>Change Assignee</DropdownMenuItem>
                    <DropdownMenuItem>Set Priority</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
