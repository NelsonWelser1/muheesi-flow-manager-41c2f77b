
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveryNoteList from '../DeliveryNoteList';
import MapDialog from './components/MapDialog';
import DeliveryFormActions from './components/DeliveryFormActions';
import DeliveryQRCodeDisplay from './components/DeliveryQRCodeDisplay';
import DeliveryNotesFormContent from './components/DeliveryNotesFormContent';
import { useDeliveryNotesForm } from './hooks/useDeliveryNotesForm';

const DeliveryNotesForm = ({ onBack }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryStatus: 'pending',
      geolocation: ''
    }
  });
  
  const {
    showNoteList,
    setShowNoteList,
    showQRCode,
    setShowQRCode,
    deliveryData,
    showMap,
    setShowMap,
    deliveredItems,
    mapSearchQuery,
    setMapSearchQuery,
    coordinates,
    searchInputRef,
    isSubmitting,
    getGeolocation,
    handleMapSelection,
    handleMapSearch,
    handleKeyPress,
    addDeliveredItem,
    removeDeliveredItem,
    validateAndSubmit,
    debugFormData,
    loadDeliveryNotes
  } = useDeliveryNotesForm();

  // Load delivery notes from database on component mount
  useEffect(() => {
    console.log("DeliveryNotesForm mounted - loading data from database");
    loadDeliveryNotes();
  }, []);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    await validateAndSubmit(data);
  };

  const handleDebug = () => {
    const currentData = watch();
    debugFormData(currentData);
  };

  const handleMapLocationSelected = (address, coords) => {
    setValue('deliveryLocation', address);
    return handleMapSelection(address, coords);
  };

  if (showQRCode && deliveryData) {
    return (
      <DeliveryQRCodeDisplay 
        deliveryData={deliveryData} 
        onBack={() => setShowQRCode(false)} 
      />
    );
  }

  return (
    <div className="space-y-4">
      <DeliveryFormActions 
        onBack={onBack} 
        setShowNoteList={setShowNoteList} 
        onDebug={handleDebug}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Delivery Notes Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DeliveryNotesFormContent
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              getGeolocation={getGeolocation}
              addDeliveredItem={addDeliveredItem}
              deliveredItems={deliveredItems}
              removeDeliveredItem={removeDeliveredItem}
              deliveryData={deliveryData}
              onShowQRCode={() => setShowQRCode(true)}
              isSubmitting={isSubmitting}
              onDebug={handleDebug}
            />
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
        handleMapSelection={handleMapLocationSelected}
        mapSearchQuery={mapSearchQuery}
        setMapSearchQuery={setMapSearchQuery}
        handleMapSearch={handleMapSearch}
        handleKeyPress={handleKeyPress}
        searchInputRef={searchInputRef}
      />
    </div>
  );
};

export default DeliveryNotesForm;
