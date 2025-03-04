
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

const initialFormState = {
  customer: '',
  product: '',
  quantity: '',
  unit: '',
  price: '',
  destination: '',
  deliveryDate: new Date().toISOString().split('T')[0],
};

export const useDistributionForm = () => {
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // For mock data, we're simulating a successful save
      // In a real app, you would save to the database like:
      /*
      const { error } = await supabase
        .from('distribution_records')
        .insert({
          customer: formState.customer,
          product: formState.product,
          quantity: Number(formState.quantity),
          unit: formState.unit,
          price: Number(formState.price),
          destination: formState.destination,
          delivery_date: formState.deliveryDate,
          status: 'pending'
        });
      
      if (error) throw error;
      */
      
      console.log('Saving distribution record:', formState);
      return true;
    } catch (error) {
      console.error('Error saving distribution record:', error);
      return false;
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    resetForm
  };
};
