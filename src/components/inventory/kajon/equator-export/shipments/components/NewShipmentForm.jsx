
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  Ship,
  Package,
  Globe,
  Users,
  Anchor,
  Map,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const NewShipmentForm = ({ onCancel }) => {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [etaDate, setEtaDate] = useState(new Date());
  
  const form = useForm({
    defaultValues: {
      shipmentId: `EQ-${Math.floor(1000 + Math.random() * 9000)}`,
      destination: '',
      client: '',
      status: 'scheduled',
      container: '20ft',
      volume: '',
      vessel: '',
      route: '',
    }
  });

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'loading', label: 'Loading' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'delayed', label: 'Delayed' }
  ];

  const containerOptions = [
    { value: '20ft', label: '20ft Standard' },
    { value: '40ft', label: '40ft Standard' },
    { value: '40hc', label: '40ft High Cube' },
    { value: 'bulk', label: 'Bulk Shipment' }
  ];

  const vesselOptions = [
    { value: 'MSC Augusta', label: 'MSC Augusta' },
    { value: 'Maersk Nebula', label: 'Maersk Nebula' },
    { value: 'CMA CGM Rhone', label: 'CMA CGM Rhone' },
    { value: 'NYK Hermes', label: 'NYK Hermes' },
    { value: 'MSC Sarah', label: 'MSC Sarah' }
  ];

  const routeOptions = [
    { value: 'Mombasa → Suez Canal → Rotterdam → Hamburg', label: 'East Africa to Europe (via Suez)' },
    { value: 'Mombasa → Cape Town → New York', label: 'East Africa to North America (via Atlantic)' },
    { value: 'Mombasa → Singapore → Tokyo', label: 'East Africa to Asia (via Indian Ocean)' },
    { value: 'Mombasa → Jeddah → Dubai', label: 'East Africa to Middle East' },
    { value: 'Mombasa → Suez Canal → Rotterdam → Amsterdam', label: 'East Africa to Netherlands' }
  ];

  const clientOptions = [
    { value: 'European Coffee Roasters GmbH', label: 'European Coffee Roasters GmbH' },
    { value: 'Artisan Bean Co.', label: 'Artisan Bean Co.' },
    { value: 'Tokyo Coffee Imports', label: 'Tokyo Coffee Imports' },
    { value: 'Middle East Coffee Trading LLC', label: 'Middle East Coffee Trading LLC' },
    { value: 'Nordic Coffee Collective', label: 'Nordic Coffee Collective' }
  ];

  const onSubmit = (data) => {
    // Combine form data with dates
    const shipmentData = {
      ...data,
      departureDate: format(date, 'yyyy-MM-dd'),
      eta: format(etaDate, 'yyyy-MM-dd'),
      lastUpdate: format(new Date(), 'yyyy-MM-dd')
    };

    console.log('Shipment data submitted:', shipmentData);
    
    // Show success toast
    toast({
      title: "Shipment Created",
      description: `Shipment ${shipmentData.shipmentId} has been created successfully.`,
      duration: 5000,
    });

    // Reset form after submission
    form.reset();
    setDate(new Date());
    setEtaDate(new Date());
    
    // In a real app, you would save this to your database
    if (onCancel) onCancel();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Ship className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Create New Shipment</h2>
        </div>
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shipments
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span>Shipment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shipmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipment ID</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="container"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Container Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select container type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {containerOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 18 tons" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Estimated Arrival (ETA)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !etaDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {etaDate ? format(etaDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={etaDate}
                          onSelect={setEtaDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span>Destination & Route</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Hamburg, Germany" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vessel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vessel</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Available vessels: MSC Augusta, Maersk Nebula, etc." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vesselOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="E.g.: East Africa to Europe, East Africa to Asia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {routeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Client Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="E.g.: European Coffee Roasters, Tokyo Coffee Imports" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any special handling instructions or notes"
                        className="resize-none"
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Shipment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewShipmentForm;
