
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const callSchema = z.object({
  contactId: z.string().min(1, "Please select a contact"),
  direction: z.enum(["incoming", "outgoing"]),
  status: z.enum(["completed", "missed", "voicemail", "scheduled"]),
  notes: z.string().optional(),
  duration: z.string().optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

const CallLogView = () => {
  const [callLogs, setCallLogs] = useState([
    {
      id: 1,
      contactId: "1",
      contactName: "John Smith",
      company: "Grand Berna Dairies",
      direction: "incoming",
      status: "completed",
      timestamp: "2024-04-16T10:30:00",
      duration: "15 minutes",
      notes: "Discussed dairy supply needs for next month. John will increase his order by 20%."
    },
    {
      id: 2,
      contactId: "2",
      contactName: "Sarah Johnson",
      company: "KAJON Coffee Limited",
      direction: "outgoing",
      status: "completed",
      timestamp: "2024-04-15T14:45:00",
      duration: "8 minutes",
      notes: "Called about specialized coffee beans price negotiation."
    },
    {
      id: 3,
      contactId: "3",
      contactName: "David Brown",
      company: "FreshEco Farms",
      direction: "outgoing",
      status: "missed",
      timestamp: "2024-04-15T09:15:00",
      duration: null,
      notes: "Attempted to reach about delivery schedule."
    },
    {
      id: 4,
      contactId: "2",
      contactName: "Sarah Johnson",
      company: "KAJON Coffee Limited",
      direction: "incoming",
      status: "voicemail",
      timestamp: "2024-04-14T16:20:00",
      duration: null,
      notes: "Left voicemail about shipping documents."
    },
    {
      id: 5,
      contactId: "1",
      contactName: "John Smith",
      company: "Grand Berna Dairies",
      direction: "outgoing",
      status: "scheduled",
      timestamp: "2024-04-20T11:00:00",
      duration: null,
      notes: "Scheduled call to discuss new product offerings."
    }
  ]);

  const [openNewCallDialog, setOpenNewCallDialog] = useState(false);
  const [contacts, setContacts] = useState([
    { id: "1", name: "John Smith", company: "Grand Berna Dairies" },
    { id: "2", name: "Sarah Johnson", company: "KAJON Coffee Limited" },
    { id: "3", name: "David Brown", company: "FreshEco Farms" },
    { id: "4", name: "Emily Wilson", company: "Organic Co-op" },
    { id: "5", name: "Michael Lee", company: "Produce Distributors" }
  ]);

  const form = useForm({
    resolver: zodResolver(callSchema),
    defaultValues: {
      contactId: "",
      direction: "outgoing",
      status: "completed",
      notes: "",
      duration: "",
      scheduledDate: "",
      scheduledTime: ""
    }
  });

  const handleAddCall = (values) => {
    const selectedContact = contacts.find(c => c.id === values.contactId);
    
    const newCall = {
      id: callLogs.length + 1,
      contactId: values.contactId,
      contactName: selectedContact.name,
      company: selectedContact.company,
      direction: values.direction,
      status: values.status,
      timestamp: values.status === "scheduled" 
        ? `${values.scheduledDate}T${values.scheduledTime}:00` 
        : new Date().toISOString(),
      duration: values.duration || null,
      notes: values.notes || null
    };
    
    setCallLogs([newCall, ...callLogs]);
    setOpenNewCallDialog(false);
    form.reset();
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "missed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Missed</Badge>;
      case "voicemail":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Voicemail</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDirectionIcon = (direction) => {
    if (direction === "incoming") {
      return <PhoneIncoming className="h-4 w-4 text-blue-500" />;
    } else {
      return <PhoneOutgoing className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Call Log</CardTitle>
            <Dialog open={openNewCallDialog} onOpenChange={setOpenNewCallDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Call
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddCall)}>
                    <DialogHeader>
                      <DialogTitle>Log a Call</DialogTitle>
                      <DialogDescription>
                        Record details about your call with a contact.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="contactId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a contact" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {contacts.map((contact) => (
                                  <SelectItem key={contact.id} value={contact.id}>
                                    {contact.name} ({contact.company})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="direction"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Direction</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select direction" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="incoming">Incoming</SelectItem>
                                  <SelectItem value="outgoing">Outgoing</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="missed">Missed</SelectItem>
                                  <SelectItem value="voicemail">Voicemail</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("status") === "completed" && (
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 15 minutes" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      {form.watch("status") === "scheduled" && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="scheduledTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add notes about the call here..." 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenNewCallDialog(false)} type="button">
                        Cancel
                      </Button>
                      <Button type="submit">Save Call</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search calls..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Calls</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="missed">Missed</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callLogs.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(call.contactName)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{call.contactName}</div>
                      <div className="text-sm text-muted-foreground">{call.company}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getDirectionIcon(call.direction)}
                        <span className="ml-2 capitalize">{call.direction}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(call.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {call.status === "scheduled" ? (
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        {format(new Date(call.timestamp), "MMM d, yyyy")}
                        <br />
                        {format(new Date(call.timestamp), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell>{call.duration || "—"}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate">{call.notes || "—"}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallLogView;
