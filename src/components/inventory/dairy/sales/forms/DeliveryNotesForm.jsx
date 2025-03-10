
import React, { useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DeliveryNoteList from '../DeliveryNoteList';
import QRCodeGenerator from '../../qr/QRCodeGenerator';
import MapDialog from './components/MapDialog';
import DeliveredItemsList from './components/DeliveredItemsList';
import AddItemForm from './components/AddItemForm';
import DeliveryInfoFields from './components/DeliveryInfoFields';
import DigitalSignature from './components/DigitalSignature';
import DeliveryFormActions from './components/DeliveryFormActions';

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

  const addDeliveredItem = (newItem) => {
    setDeliveredItems([...deliveredItems, newItem]);
    
    // Reset form fields
    setValue("itemName", "");
    setValue("itemQuantity", "");
    setValue("itemUnit", "");
    
    toast({
      title: "Item Added",
      description: `${newItem.quantity} ${newItem.unit} of ${newItem.name} added to delivery note`,
    });
  };

  const removeDeliveredItem = (index) => {
    const updatedItems = deliveredItems.filter((_, i) => i !== index);
    setDeliveredItems(updatedItems);
  };

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
      <DeliveryFormActions onBack={onBack} setShowNoteList={setShowNoteList} />
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Notes Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DeliveryInfoFields 
              register={register} 
              errors={errors} 
              setValue={setValue} 
              getGeolocation={getGeolocation} 
            />

            <div className="space-y-2">
              <Label>Delivered Items</Label>
              <div className="border rounded-lg p-4 space-y-4">
                <AddItemForm 
                  register={register} 
                  addDeliveredItem={addDeliveredItem} 
                  watch={watch}
                />
                <DeliveredItemsList 
                  deliveredItems={deliveredItems} 
                  removeDeliveredItem={removeDeliveredItem} 
                />
              </div>
            </div>

            <DigitalSignature />

            <div className="flex flex-wrap gap-4">
              <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]">
                Submit Delivery Note
              </Button>
              {deliveryData && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowQRCode(true)}
                >
                  View QR Code
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <DeliveryNoteList 
        isOpen={showNoteList} 
        onClose={() => setShowNoteList(false)}
        deliveryData={deliveryData}
      />

      <MapDialog 
        showMap={showMap}
        setShowMap={setShowMap}
        mapSearchQuery={mapSearchQuery}
        setMapSearchQuery={setMapSearchQuery}
        handleMapSearch={handleMapSearch}
        handleKeyPress={handleKeyPress}
        handleMapSelection={handleMapSelection}
        searchInputRef={searchInputRef}
      />
    </div>
  );
};

export default DeliveryNotesForm;
