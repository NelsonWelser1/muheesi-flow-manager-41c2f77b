import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { CalendarIcon, Save, RefreshCw, Droplet } from "lucide-react";
import { useMilkProduction } from '@/hooks/useMilkProduction';
import { useToast } from "@/hooks/use-toast";

const MilkProductionForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [session, setSession] = useState('');
  const [volume, setVolume] = useState('');
  const [milkingCows, setMilkingCows] = useState('');
  const [fatContent, setFatContent] = useState('');
  const [proteinContent, setProteinContent] = useState('');
  const [location, setLocation] = useState('Main Farm');
  const [notes, setNotes] = useState('');
  
  const {
    addMilkProduction,
    isSubmitting,
    error
  } = useMilkProduction();

  const locations = ['Main Farm', 'North Paddock', 'South Paddock', 'East Paddock', 'West Paddock', 'Milking Parlor 1', 'Milking Parlor 2'];
  
  const sessions = [
    {
      value: 'morning',
      label: 'Morning (5am - 8am)'
    }, 
    {
      value: 'midday',
      label: 'Midday (11am - 1pm)'
    }, 
    {
      value: 'evening',
      label: 'Evening (4pm - 6pm)'
    }
  ];

  const resetForm = () => {
    setDate(new Date());
    setSession('');
    setVolume('');
    setMilkingCows('');
    setFatContent('');
    setProteinContent('');
    setLocation('Main Farm');
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!session) {
      toast({
        title: "Error",
        description: "Please select a milking session",
        variant: "destructive"
      });
      return;
    }
    
    if (!volume || isNaN(Number(volume)) || Number(volume) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid milk volume",
        variant: "destructive"
      });
      return;
    }
    
    if (!milkingCows || isNaN(Number(milkingCows)) || Number(milkingCows) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of milking cows",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for submission to Supabase
    const milkData = {
      date: format(date, 'yyyy-MM-dd'),
      session,
      volume: Number(volume),
      milkingCows: Number(milkingCows),
      fatContent: fatContent ? Number(fatContent) : null,
      proteinContent: proteinContent ? Number(proteinContent) : null,
      location,
      notes
    };

    try {
      // Submit data using the hook
      const result = await addMilkProduction(milkData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Milk production record has been saved successfully",
        });
        resetForm();
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to save milk production record",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Record Kashari Farm Milk Production
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(newDate) => setDate(newDate || new Date())} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Milking Session */}
            <div className="space-y-2">
              <Label htmlFor="session">Milking Session *</Label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger id="session">
                  <SelectValue placeholder="Select milking time" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.value} value={session.value}>
                      {session.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Milk Volume */}
            <div className="space-y-2">
              <Label htmlFor="volume">Milk Volume (Liters) *</Label>
              <Input
                id="volume"
                type="number"
                min="0"
                step="0.1"
                value={volume}
                onChange={e => setVolume(e.target.value)}
                placeholder="Enter milk volume"
              />
            </div>
            
            {/* Number of Milking Cows */}
            <div className="space-y-2">
              <Label htmlFor="milkingCows">Number of Milking Cows *</Label>
              <Input
                id="milkingCows"
                type="number"
                min="1"
                step="1"
                value={milkingCows}
                onChange={e => setMilkingCows(e.target.value)}
                placeholder="Enter number of cows"
                className="flex items-center"
              />
            </div>
            
            {/* Fat Content */}
            <div className="space-y-2">
              <Label htmlFor="fatContent">Fat Content (%)</Label>
              <Input
                id="fatContent"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={fatContent}
                onChange={e => setFatContent(e.target.value)}
                placeholder="Fat percentage (optional)"
              />
            </div>
            
            {/* Protein Content */}
            <div className="space-y-2">
              <Label htmlFor="proteinContent">Protein Content (%)</Label>
              <Input
                id="proteinContent"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={proteinContent}
                onChange={e => setProteinContent(e.target.value)}
                placeholder="Protein percentage (optional)"
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any additional notes or observations"
              rows={3}
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={isSubmitting}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Record
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default MilkProductionForm;
