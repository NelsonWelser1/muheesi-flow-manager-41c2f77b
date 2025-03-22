
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const StockFilters = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('all');
  const [location, setLocation] = useState('all');
  const [stockLevel, setStockLevel] = useState([0, 100]);
  const [date, setDate] = useState(null);
  
  const handleFilterApply = () => {
    onFilterChange({
      searchTerm,
      type,
      location,
      stockLevel,
      date
    });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setType('all');
    setLocation('all');
    setStockLevel([0, 100]);
    setDate(null);
    onFilterChange({
      searchTerm: '',
      type: 'all',
      location: 'all',
      stockLevel: [0, 100],
      date: null
    });
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stock items..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Coffee Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coffee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="arabica">Arabica</SelectItem>
                  <SelectItem value="robusta">Robusta</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="kampala">Kampala Warehouse</SelectItem>
                  <SelectItem value="mbarara">Mbarara Facility</SelectItem>
                  <SelectItem value="jinja">Jinja Storage</SelectItem>
                  <SelectItem value="entebbe">Entebbe Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Stock Level: {stockLevel[0]}% - {stockLevel[1]}%
            </label>
            <Slider
              defaultValue={[0, 100]}
              min={0}
              max={100}
              step={5}
              value={stockLevel}
              onValueChange={setStockLevel}
              className="my-4"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Updated After</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleFilterApply}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockFilters;
