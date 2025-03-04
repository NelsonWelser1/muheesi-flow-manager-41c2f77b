
import React from 'react';
import { DatePicker } from "@/components/ui/date-picker";

const CustomDatePicker = ({ date, setDate, className }) => {
  return (
    <DatePicker 
      date={date} 
      setDate={setDate} 
      className={className} 
    />
  );
};

export default CustomDatePicker;
