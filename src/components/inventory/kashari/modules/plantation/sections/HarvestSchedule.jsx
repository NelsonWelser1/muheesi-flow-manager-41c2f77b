
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Search, Calendar as CalendarIcon2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, isSameDay, isBefore, isAfter, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePlantingHarvestingSchedule } from '@/hooks/usePlantingHarvestingSchedule';

const HarvestSchedule = () => {
  const { 
    scheduleData, 
    schedules, 
    loading, 
    error, 
    setScheduleData, 
    handleInputChange, 
    handleDateChange, 
    handleSelectChange, 
    saveSchedule, 
    fetchSchedules 
  } = usePlantingHarvestingSchedule('kashari');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  
  const cropTypes = [
    { value: 'banana', label: 'Banana' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'maize', label: 'Maize' },
    { value: 'beans', label: 'Beans' },
    { value: 'cassava', label: 'Cassava' }
  ];

  const varieties = {
    banana: ['Kibuzi', 'Mpologoma', 'Nakitembe', 'FHIA', 'Gonja'],
    coffee: ['Arabica', 'Robusta', 'Bourbon', 'Typica'],
    maize: ['Longe 5', 'Hybrid 6303', 'Local Variety'],
    beans: ['K132', 'NABE 15', 'NABE 16', 'NABE 17'],
    cassava: ['NASE 14', 'NASE 19', 'TME 14']
  };

  const activityTypes = [
    { value: 'planting', label: 'Planting' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'pruning', label: 'Pruning' },
    { value: 'fertilizing', label: 'Fertilizing' },
    { value: 'weeding', label: 'Weeding' },
    { value: 'spraying', label: 'Spraying' }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    await saveSchedule();
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (schedule.activity_type && schedule.activity_type.toLowerCase().includes(search)) ||
      (schedule.crop_variety && schedule.crop_variety.toLowerCase().includes(search)) ||
      (schedule.responsible_person && schedule.responsible_person.toLowerCase().includes(search)) ||
      (schedule.notes && schedule.notes.toLowerCase().includes(search))
    );
  });

  // Get schedules for the selected date
  const schedulesForDate = (date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduled_date);
      return isSameDay(scheduleDate, date);
    });
  };

  // Get all days in the current week
  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 1 })
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-2xl font-bold">Planting & Harvesting Schedule</h2>
        <div className="flex space-x-2">
          <Button 
            variant={view === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setView('calendar')}
            className="flex items-center"
          >
            <CalendarIcon2 className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            onClick={() => setView('list')}
            className="flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Farm Name</label>
                <Input
                  name="farm_name"
                  value={scheduleData.farm_name}
                  onChange={handleInputChange}
                  placeholder="Enter farm name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Type</label>
                <Select 
                  name="activity_type"
                  value={scheduleData.activity_type} 
                  onValueChange={(value) => handleSelectChange('activity_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(activity => (
                      <SelectItem key={activity.value} value={activity.value}>
                        {activity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Crop Variety</label>
                <Input
                  name="crop_variety"
                  value={scheduleData.crop_variety || ''}
                  onChange={handleInputChange}
                  placeholder="E.g., Arabica, Robusta, Matooke"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Plot Area (acres)</label>
                <Input
                  name="plot_area"
                  type="number"
                  min="0"
                  step="0.1"
                  value={scheduleData.plot_area || ''}
                  onChange={handleInputChange}
                  placeholder="Area in acres"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Scheduled Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleData.scheduled_date ? format(new Date(scheduleData.scheduled_date), 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduleData.scheduled_date ? new Date(scheduleData.scheduled_date) : null}
                      onSelect={(date) => handleDateChange('scheduled_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Completion Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleData.expected_completion_date ? format(new Date(scheduleData.expected_completion_date), 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduleData.expected_completion_date ? new Date(scheduleData.expected_completion_date) : null}
                      onSelect={(date) => handleDateChange('expected_completion_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsible Person</label>
                <Input
                  name="responsible_person"
                  value={scheduleData.responsible_person || ''}
                  onChange={handleInputChange}
                  placeholder="Person in charge"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  name="status"
                  value={scheduleData.status || 'scheduled'} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  name="notes"
                  value={scheduleData.notes || ''}
                  onChange={handleInputChange}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Schedule
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          {view === 'calendar' ? (
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Calendar View</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedDate(new Date())}
                    size="sm"
                  >
                    Today
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(selectedDate, 'MMMM yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-px bg-muted">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="bg-background p-2 text-center text-sm font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-px bg-muted">
                    {daysInWeek.map((day) => {
                      const daySchedules = schedulesForDate(day);
                      const isToday = isSameDay(day, new Date());
                      
                      return (
                        <div 
                          key={day.toString()} 
                          className={`bg-background min-h-[100px] p-2 ${isToday ? 'border border-primary' : ''}`}
                        >
                          <div className="font-medium text-sm mb-1">
                            {format(day, 'd')}
                          </div>
                          <div className="space-y-1">
                            {daySchedules.map((schedule) => (
                              <div 
                                key={schedule.id} 
                                className={`text-xs p-1 rounded truncate ${
                                  schedule.activity_type === 'planting' ? 'bg-green-100 text-green-800' : 
                                  schedule.activity_type === 'harvesting' ? 'bg-amber-100 text-amber-800' : 
                                  schedule.activity_type === 'pruning' ? 'bg-blue-100 text-blue-800' : 
                                  schedule.activity_type === 'fertilizing' ? 'bg-purple-100 text-purple-800' : 
                                  schedule.activity_type === 'weeding' ? 'bg-rose-100 text-rose-800' : 
                                  schedule.activity_type === 'spraying' ? 'bg-cyan-100 text-cyan-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {activityTypes.find(a => a.value === schedule.activity_type)?.label || schedule.activity_type}: {schedule.crop_variety || 'N/A'}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <CardTitle>Schedule List</CardTitle>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading schedules...</div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {schedules.length === 0 
                      ? "No schedules added yet. Use the form to add a schedule."
                      : "No matching schedules found. Try a different search term."}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Crop</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Responsible</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSchedules.map(schedule => (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              {schedule.scheduled_date ? format(new Date(schedule.scheduled_date), 'dd/MM/yyyy') : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                schedule.activity_type === 'planting' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                schedule.activity_type === 'harvesting' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : 
                                schedule.activity_type === 'pruning' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                                schedule.activity_type === 'fertilizing' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : 
                                schedule.activity_type === 'weeding' ? 'bg-rose-100 text-rose-800 hover:bg-rose-100' : 
                                schedule.activity_type === 'spraying' ? 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' : 
                                'bg-gray-100 text-gray-800 hover:bg-gray-100'
                              }>
                                {activityTypes.find(a => a.value === schedule.activity_type)?.label || schedule.activity_type}
                              </Badge>
                            </TableCell>
                            <TableCell>{schedule.crop_variety || 'N/A'}</TableCell>
                            <TableCell>{schedule.plot_area || 'N/A'} acres</TableCell>
                            <TableCell>{schedule.responsible_person || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge className={
                                schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                                schedule.status === 'in_progress' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : 
                                schedule.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                schedule.status === 'pending' ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' : 
                                'bg-red-100 text-red-800 hover:bg-red-100'
                              }>
                                {statusOptions.find(s => s.value === schedule.status)?.label || schedule.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HarvestSchedule;
