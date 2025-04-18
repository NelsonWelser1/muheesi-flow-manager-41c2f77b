
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";

const TaskCalendarView = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthView, setMonthView] = useState(new Date());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // Filter tasks for the selected date
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  // Filter tasks for the current month for highlighting dates with tasks
  const monthTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return isSameMonth(taskDate, monthView);
  });

  // Get dates with tasks for highlighting
  const datesWithTasks = monthTasks.map(task => new Date(task.dueDate));

  // Navigate to previous/next month
  const goToPreviousMonth = () => setMonthView(prevMonth => subMonths(prevMonth, 1));
  const goToNextMonth = () => setMonthView(prevMonth => addMonths(prevMonth, 1));

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "text-gray-500";
      case "in-progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "postponed":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  // Generate days for the month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(monthView),
    end: endOfMonth(monthView)
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold">Calendar View</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover open={showCalendarPicker} onOpenChange={setShowCalendarPicker}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(monthView, 'MMMM yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="month"
                selected={monthView}
                onSelect={(date) => {
                  setMonthView(date || new Date());
                  setShowCalendarPicker(false);
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Calendar Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="hidden md:block text-center font-medium text-sm p-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {daysInMonth.map((day) => {
          const hasTasks = datesWithTasks.some(date => isSameDay(date, day));
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              className={`border rounded-lg p-2 min-h-[100px] cursor-pointer transition-colors
                ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}
                ${!isSameMonth(day, monthView) ? 'opacity-50' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </span>
                {hasTasks && <Badge variant="outline">{
                  tasks.filter(task => isSameDay(new Date(task.dueDate), day)).length
                }</Badge>}
              </div>
              <div className="space-y-1 overflow-hidden max-h-[80px]">
                {tasks
                  .filter(task => isSameDay(new Date(task.dueDate), day))
                  .slice(0, 2)
                  .map((task) => (
                    <div key={task.id} className={`text-xs p-1 rounded truncate ${getPriorityClass(task.priority)}`}>
                      {task.title}
                    </div>
                  ))}
                {tasks.filter(task => isSameDay(new Date(task.dueDate), day)).length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{tasks.filter(task => isSameDay(new Date(task.dueDate), day)).length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Tasks View */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">
          Tasks for {format(selectedDate, 'PPPP')}
        </h3>
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No tasks scheduled for this day
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      <div className="flex items-center mt-2 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityClass(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className={`text-sm ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarView;
