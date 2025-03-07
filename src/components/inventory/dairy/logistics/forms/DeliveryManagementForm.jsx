
import React from 'react';
import DeliveryRecordsDisplay from "./displays/DeliveryRecordsDisplay";
import FormHeader from "./components/FormHeader";
import DeliveryFormFields from "./components/DeliveryFormFields";
import FormActions from "./components/FormActions";
import ValidationAlert from "./components/ValidationAlert";
import { useDeliveryForm } from "./hooks/useDeliveryForm";

const DeliveryManagementForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    onSubmit,
    getFieldError,
    showRecords,
    setShowRecords,
    serverErrors,
    handleReset
  } = useDeliveryForm();

  if (showRecords) {
    return <DeliveryRecordsDisplay onBack={() => setShowRecords(false)} />;
  }

  return (
    <div>
      <FormHeader onShowRecords={() => setShowRecords(true)} />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ValidationAlert visible={Object.keys(serverErrors).length > 0} />
      
        <DeliveryFormFields 
          register={register} 
          setValue={setValue} 
          getFieldError={getFieldError} 
        />

        <FormActions onReset={handleReset} />
      </form>
    </div>
  );
};

export default DeliveryManagementForm;
