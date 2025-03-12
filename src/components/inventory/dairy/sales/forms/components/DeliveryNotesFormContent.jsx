import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Bug } from "lucide-react";
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
  onShowQRCode,
  isSubmitting,
  onDebug
}) => {
  return <div className="space-y-4">
      <DeliveryInfoFields register={register} errors={errors} setValue={setValue} getGeolocation={getGeolocation} />

      <div className="space-y-2">
        <div className="border rounded-lg p-4 space-y-4">
          <AddItemForm register={register} addDeliveredItem={addDeliveredItem} watch={watch} />
          <DeliveredItemsList deliveredItems={deliveredItems} removeDeliveredItem={removeDeliveredItem} />
        </div>
      </div>

      <DigitalSignature />

      <div className="flex flex-wrap gap-4">
        <Button type="submit" className="bg-[#0000a0] hover:bg-[#00008b]" disabled={isSubmitting}>
          {isSubmitting ? <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </> : "Submit Delivery Note"}
        </Button>
        
        
        
        {deliveryData && <Button type="button" variant="outline" onClick={onShowQRCode}>
            View QR Code
          </Button>}
      </div>
    </div>;
};
export default DeliveryNotesFormContent;