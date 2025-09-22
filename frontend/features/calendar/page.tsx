import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Plus } from "lucide-react"

export default function CalendarPage() {
  // Mock data for calendar events
  const events = [
    {
      id: 1,
      title: "Website Design Review",
      project: "Website Redesign",
      date: "2025-05-15",
      time: "10:00 AM - 11:30 AM",
      participants: 4,
    },
  ]

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    // Mock logic to match events to days
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === day
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Schedule and manage your project timeline</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">May 2025</div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Today</Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <div className="grid grid-cols-7 text-center">
            <div className="font-medium">Sun</div>
            <div className="font-medium">Mon</div>
            <div className="font-medium">Tue</div>
            <div className="font-medium">Wed</div>
            <div className="font-medium">Thu</div>
            <div className="font-medium">Fri</div>
            <div className="font-medium">Sat</div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day)
              const isToday = day === 15 // Mock current day
              const isWeekend = index % 7 === 0 || index % 7 === 6

              return (
                <div
                  key={day}
                  className={`min-h-[120px] p-2 border border-border ${
                    isToday ? "bg-primary/5" : ""
                  } ${isWeekend ? "bg-muted/50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View All Events</DropdownMenuItem>
                          <DropdownMenuItem>Add Event</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded bg-primary/10 truncate cursor-pointer hover:bg-primary/20"
                        title={event.title}
                      >
                        {event.time.split(" - ")[0]} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {events.map((event) => (
            <div key={event.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{event.project}</div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <div>{event.time}</div>
                <div>{event.participants} participants</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
