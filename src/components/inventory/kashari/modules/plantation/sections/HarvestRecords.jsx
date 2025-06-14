
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useHarvestRecords } from "@/hooks/useHarvestRecords";
import AddHarvestForm from './harvest-records/AddHarvestForm';
import HarvestTable from './harvest-records/HarvestTable';
import { cropTypes } from './harvest-records/harvestConstants';

const HarvestRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Use the custom hook for harvest records
  const { 
    records, 
    isLoading, 
    isFetching, 
    fetchHarvestRecords, 
    saveHarvestRecord 
  } = useHarvestRecords();

  // Fetch records from Supabase on component mount
  useEffect(() => {
    console.log("Component mounted, fetching harvest records");
    fetchHarvestRecords();
  }, []);

  return (
    <div className="space-y-6">
      <AddHarvestForm 
        onSubmit={saveHarvestRecord}
        isLoading={isLoading}
      />
      
      <HarvestTable 
        records={records}
        isFetching={isFetching}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cropTypes={cropTypes}
      />
    </div>
  );
};

export default HarvestRecords;
