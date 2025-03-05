
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, Trash, Upload, X, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdvertisingPromotions } from './hooks/useAdvertisingPromotions';

const AdvertisingPromotionForm = ({ onBack, onViewReports }) => {
  const { toast } = useToast();
  const { isSubmitting, submitPromotion } = useAdvertisingPromotions();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [channels, setChannels] = useState([
    { name: '', audience: '', budget: '', description: '' }
  ]);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

  const form = useForm({
    defaultValues: {
      promotion_title: '',
      promotion_type: 'advertisement',
      material_type: 'digital',
      start_date: '',
      end_date: '',
      target_audience: '',
      objectives: '',
      budget: '',
      status: 'planning'
    }
  });

  const addChannel = () => {
    setChannels([...channels, { name: '', audience: '', budget: '', description: '' }]);
  };

  const removeChannel = (index) => {
    if (channels.length > 1) {
      const newChannels = [...channels];
      newChannels.splice(index, 1);
      setChannels(newChannels);
    }
  };

  const handleChannelChange = (index, field, value) => {
    const newChannels = [...channels];
    newChannels[index][field] = value;
    setChannels(newChannels);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        file: file
      }));
      
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== id));
  };

  // Debug handler
  const handleDebugPrint = () => {
    const formData = form.getValues();
    console.log('Current form data:', {
      ...formData,
      channels: channels,
      files: selectedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
    });
    toast({
      title: "Debug Info",
      description: "Form data printed to console"
    });
  };

  const onSubmit = async (data) => {
    // If debug mode is enabled, log the form data
    if (debugModeEnabled) {
      console.log('Form submission data:', {
        ...data,
        channels: channels,
        files: selectedFiles.map(f => ({ name: f.name, type: f.type, size: f.size }))
      });
    }
    
    const success = await submitPromotion(
      { ...data, channels: channels },
      selectedFiles
    );
    
    if (success) {
      // Reset form
      form.reset({
        promotion_title: '',
        promotion_type: 'advertisement',
        material_type: 'digital',
        start_date: '',
        end_date: '',
        target_audience: '',
        objectives: '',
        budget: '',
        status: 'planning'
      });
      setChannels([{ name: '', audience: '', budget: '', description: '' }]);
      setSelectedFiles([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setDebugModeEnabled(!debugModeEnabled)}
            className="flex items-center gap-2"
          >
            {debugModeEnabled ? 'Disable Debug' : 'Enable Debug'}
          </Button>
          
          {debugModeEnabled && (
            <Button
              variant="outline"
              onClick={handleDebugPrint}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Print Form Data
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onViewReports}
            className="flex items-center gap-2"
          >
            View Campaigns
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advertising & Promotion Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="promotion_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter promotion title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="promotion_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select promotion type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="advertisement">Advertisement</SelectItem>
                          <SelectItem value="seasonal_offer">Seasonal Offer</SelectItem>
                          <SelectItem value="discount">Discount</SelectItem>
                          <SelectItem value="bundle">Bundle Offer</SelectItem>
                          <SelectItem value="loyalty">Loyalty Program</SelectItem>
                          <SelectItem value="event">Event Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="material_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="print">Print</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                          <SelectItem value="mixed">Mixed Media</SelectItem>
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
                      <Select 
                        defaultValue={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">
                            <div className="flex items-center">
                              <span>Planning</span>
                              <Badge variant="secondary" className="ml-2">Planning</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="active">
                            <div className="flex items-center">
                              <span>Active</span>
                              <Badge variant="success" className="ml-2">Active</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <span>Completed</span>
                              <Badge variant="default" className="ml-2">Completed</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <div className="flex items-center">
                              <span>Cancelled</span>
                              <Badge variant="destructive" className="ml-2">Cancelled</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter budget amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="target_audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the target audience"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter promotion objectives"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Distribution Channels</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChannel}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Channel
                  </Button>
                </div>

                {channels.map((channel, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Channel {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChannel(index)}
                        disabled={channels.length <= 1}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormLabel>Channel Name</FormLabel>
                        <Input
                          placeholder="E.g., Facebook, Radio, Newspaper"
                          value={channel.name}
                          onChange={(e) => handleChannelChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Target Audience</FormLabel>
                        <Input
                          placeholder="Audience for this channel"
                          value={channel.audience}
                          onChange={(e) => handleChannelChange(index, 'audience', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Budget Allocation</FormLabel>
                        <Input
                          placeholder="Budget for this channel"
                          value={channel.budget}
                          onChange={(e) => handleChannelChange(index, 'budget', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="Details about this channel"
                          value={channel.description}
                          onChange={(e) => handleChannelChange(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload Materials</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drag and drop files here, or click to select files
                    </p>
                    <Input
                      type="file"
                      multiple
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      Select Files
                    </Button>
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Files:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {debugModeEnabled && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium mb-2">Debug Information:</h3>
                  <p className="text-xs">
                    Form will submit to the <code>advertising_promotions</code> table in Supabase.
                    Files will be uploaded to the <code>marketing</code> bucket in Supabase Storage.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create Promotion"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisingPromotionForm;
