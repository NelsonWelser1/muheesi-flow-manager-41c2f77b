
import React from 'react';
import { Button } from "@/components/ui/button";
import DeliveryInfoFields from './DeliveryInfoFields';
import AddItemForm from './AddItemForm';
import DeliveredItemsList from './DeliveredItemsList';
import DigitalSignature from './DigitalSignature';

const DeliveryNotesFormContent = ({
  register,
  errors,
  setValue,
  watch,
  getGeolocation,
  addDeliveredItem,
  deliveredItems,
  removeDeliveredItem,
  deliveryData,
  onShowQRCode
}) => {
  return (
    <div className="space-y-4">
      <DeliveryInfoFields 
        register={register} 
        errors={errors} 
        setValue={setValue} 
        getGeolocation={getGeolocation} 
      />

      <div className="space-y-2">
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
            onClick={onShowQRCode}
          >
            View QR Code
          </Button>
        )}
      </div>
    </div>
  );
};

export default DeliveryNotesFormContent;
