
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { addDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const DateRangeSearch = ({ onSearch, onRefresh }) => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [granularity, setGranularity] = React.useState('day');

  const handleGranularityChange = (value) => {
    setGranularity(value);
    const today = new Date();

    switch (value) {
      case 'hour':
        setStartDate(startOfDay(today));
        setEndDate(endOfDay(today));
        break;
      case 'day':
        setStartDate(startOfDay(today));
        setEndDate(endOfDay(today));
        break;
      case 'week':
        setStartDate(startOfWeek(today));
        setEndDate(endOfWeek(today));
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case 'year':
        setStartDate(startOfYear(today));
        setEndDate(endOfYear(today));
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    onSearch?.({ startDate, endDate, granularity });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
      <div className="space-y-1">
        <span className="text-sm font-medium">Start Date</span>
        <DatePicker date={startDate} setDate={setStartDate} />
      </div>
      
      <div className="space-y-1">
        <span className="text-sm font-medium">End Date</span>
        <DatePicker date={endDate} setDate={setEndDate} />
      </div>

      <div className="space-y-1">
        <span className="text-sm font-medium">Time Range</span>
        <Select value={granularity} onValueChange={handleGranularityChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Hours</SelectItem>
            <SelectItem value="day">Days</SelectItem>
            <SelectItem value="week">Weeks</SelectItem>
            <SelectItem value="month">Months</SelectItem>
            <SelectItem value="year">Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default DateRangeSearch;
