
import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Eye, Search, Plus, Trash } from "lucide-react";
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
  const [deliveredItems, setDeliveredItems] = useState([]);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  const onSubmit = (data) => {
    // Add delivered items to the data
    const finalData = {
      ...data,
      deliveredItems: deliveredItems
    };
    
    console.log("Delivery note data:", finalData);
    setDeliveryData(finalData);
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

  const handleMapSearch = () => {
    if (mapSearchQuery.trim()) {
      const mapElement = document.getElementById('google-map-iframe');
      if (mapElement) {
        const encodedQuery = encodeURIComponent(mapSearchQuery);
        mapElement.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedQuery}`;
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMapSearch();
    }
  };

  const addDeliveredItem = () => {
    const itemName = watch("itemName");
    const itemQuantity = watch("itemQuantity");
    const itemUnit = watch("itemUnit");
    
    if (itemName && itemQuantity && itemUnit) {
      const newItem = {
        name: itemName,
        quantity: itemQuantity,
        unit: itemUnit
      };
      
      setDeliveredItems([...deliveredItems, newItem]);
      
      // Reset form fields
      setValue("itemName", "");
      setValue("itemQuantity", "");
      setValue("itemUnit", "");
      
      toast({
        title: "Item Added",
        description: `${itemQuantity} ${itemUnit} of ${itemName} added to delivery note`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill all item details",
        variant: "destructive"
      });
    }
  };

  const removeDeliveredItem = (index) => {
    const updatedItems = deliveredItems.filter((_, i) => i !== index);
    setDeliveredItems(updatedItems);
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
        
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              ref={searchInputRef}
              className="pl-9" 
              placeholder="Search for a location..." 
              value={mapSearchQuery}
              onChange={(e) => setMapSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Button onClick={handleMapSearch}>Search</Button>
        </div>
        
        <div className="h-[500px] w-full">
          <iframe 
            id="google-map-iframe"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Kampala,Uganda" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="flex justify-between mt-3">
          <Button variant="outline" onClick={() => setShowMap(false)}>Cancel</Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                if (mapSearchQuery.trim()) {
                  handleMapSelection(mapSearchQuery);
                } else {
                  handleMapSelection("Kampala, Uganda");
                }
              }}
            >
              Use Current View
            </Button>
            <Button onClick={() => handleMapSelection(mapSearchQuery || "Kampala, Uganda")}>
              Drop Pin Here
            </Button>
          </div>
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
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addDeliveredItem}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                
                {deliveredItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Items List</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {deliveredItems.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{item.unit}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  onClick={() => removeDeliveredItem(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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
