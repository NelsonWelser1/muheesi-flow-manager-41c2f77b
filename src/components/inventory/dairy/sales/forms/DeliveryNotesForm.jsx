
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Eye } from "lucide-react";
import DeliveryNoteList from '../DeliveryNoteList';
import QRCodeGenerator from '../../qr/QRCodeGenerator';

const DeliveryNotesForm = ({ onBack }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryStatus: 'pending',
      geolocation: ''
    }
  });
  const { toast } = useToast();
  const [showNoteList, setShowNoteList] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [deliveryData, setDeliveryData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  
  const onSubmit = (data) => {
    console.log("Delivery note data:", data);
    setDeliveryData(data);
    toast({
      title: "Success",
      description: "Delivery note created successfully",
    });
    // Here you would normally save to database
  };

  const getGeolocation = () => {
    setShowMap(true);
  };

  const handleMapSelection = (address) => {
    setValue('deliveryLocation', address);
    setShowMap(false);
    
    toast({
      title: "Location Added",
      description: `Address captured: ${address}`,
    });
  };

  const MapDialog = () => (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
          <DialogDescription>
            Search for a location or drop a pin on the map to select an address.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[500px] w-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7575343289694!2d32.58333531426501!3d0.3152119641003346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb0932824161%3A0x5d7bf3737904418e!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1648566034385!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setShowMap(false)}>Cancel</Button>
          <Button onClick={() => handleMapSelection("Kampala, Uganda")}>Use Selected Location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (showQRCode && deliveryData) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowQRCode(false)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Form
        </Button>
        <QRCodeGenerator 
          data={deliveryData}
          title="Delivery Note"
        />
      </div>
    );
  }

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
        
        <Button 
          variant="outline" 
          onClick={() => setShowNoteList(true)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" /> View Delivery Notes
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Notes Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sales Order Reference</Label>
                <Input {...register("orderReference", { required: "Order reference is required" })} />
                {errors.orderReference && (
                  <p className="text-sm text-red-500">{errors.orderReference.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input type="date" {...register("deliveryDate", { required: "Delivery date is required" })} />
                {errors.deliveryDate && (
                  <p className="text-sm text-red-500">{errors.deliveryDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Receiver Name</Label>
                <Input {...register("receiverName", { required: "Receiver name is required" })} />
                {errors.receiverName && (
                  <p className="text-sm text-red-500">{errors.receiverName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Receiver Contact</Label>
                <Input {...register("receiverContact", { required: "Receiver contact is required" })} />
                {errors.receiverContact && (
                  <p className="text-sm text-red-500">{errors.receiverContact.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Delivery Location</Label>
                <div className="flex gap-2">
                  <Input {...register("deliveryLocation", { required: "Delivery location is required" })} />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2 whitespace-nowrap"
                    onClick={getGeolocation}
                  >
                    <MapPin className="h-4 w-4" />
                    Add Geolocation
                  </Button>
                </div>
                {errors.deliveryLocation && (
                  <p className="text-sm text-red-500">{errors.deliveryLocation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Delivery Person/Driver</Label>
                <Input {...register("deliveryPerson")} />
              </div>

              <div className="space-y-2">
                <Label>Delivery Status</Label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setValue("deliveryStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="hidden" {...register("deliveryStatus")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delivered Items</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input placeholder="Item name" {...register("itemName")} />
                  <Input type="number" placeholder="Quantity" {...register("itemQuantity")} />
                  <Input placeholder="Unit" {...register("itemUnit")} />
                  <Button type="button" variant="outline">Add Item</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2 border p-4 rounded-lg">
              <Label>Digital Signature</Label>
              <div className="h-20 border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">Signature capture field will appear here</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">Submit Delivery Note</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <DeliveryNoteList 
        isOpen={showNoteList} 
        onClose={() => setShowNoteList(false)}
        deliveryData={deliveryData}
      />

      {/* Map Selection Dialog */}
      <MapDialog />
    </div>
  );
};

export default DeliveryNotesForm;
