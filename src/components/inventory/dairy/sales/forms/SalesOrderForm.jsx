
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SalesOrderFormFields from './components/SalesOrderFormFields';
import SalesOrderFormActions from './components/SalesOrderFormActions';
import { useSalesOrderForm } from './hooks/useSalesOrderForm';

const SalesOrderForm = ({ onBack }) => {
  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    errors, 
    onSubmit 
  } = useSalesOrderForm();
  
  const deliveryRequired = watch("deliveryRequired");
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Sales Order Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <SalesOrderFormFields 
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
            <SalesOrderFormActions deliveryRequired={deliveryRequired} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderForm;
