
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Syringe, Activity } from "lucide-react";
import HealthRecordsTable from './HealthRecordsTable';
import AddHealthRecordDialog from './AddHealthRecordDialog';
import { supabase } from '@/integrations/supabase/supabase';
import { useHealthRecords } from '@/hooks/useHealthRecords';

const HealthRecordsView = ({ cattleData: propsCattleData = [] }) => {
  const [cattleData, setCattleData] = useState(propsCattleData);
  const [loading, setLoading] = useState(propsCattleData.length === 0);
  const { healthRecords, isLoading, error, refetch } = useHealthRecords();
  
  useEffect(() => {
    // If no cattle data is provided as props, fetch it
    const fetchCattleData = async () => {
      if (propsCattleData.length === 0) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('cattle_inventory')
            .select('id, tag_number, name');
          
          if (error) throw error;
          setCattleData(data || []);
        } catch (error) {
          console.error('Error fetching cattle data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCattleData();
  }, [propsCattleData.length]);

  // Refresh records when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Calculate statistics
  const totalRecords = healthRecords?.length || 0;
  const vaccinationCount = healthRecords?.filter(r => r.record_type === 'vaccination').length || 0;
  
  // Calculate a mock health score (for demonstration)
  const calculateHealthScore = () => {
    if (!healthRecords || healthRecords.length === 0) return '85%'; // Default value
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const recentRecords = healthRecords.filter(r => new Date(r.record_date) > lastMonth);
    return recentRecords.length > 0 ? '95%' : '85%';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Health Records</h2>
        <AddHealthRecordDialog cattleData={cattleData} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <h3 className="text-2xl font-bold">{totalRecords}</h3>
            </div>
            <Calendar className="h-8 w-8 text-purple-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Vaccinations</p>
              <h3 className="text-2xl font-bold">{vaccinationCount}</h3>
            </div>
            <Syringe className="h-8 w-8 text-blue-500 opacity-80" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <h3 className="text-2xl font-bold">{calculateHealthScore()}</h3>
            </div>
            <Activity className="h-8 w-8 text-green-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Records Table */}
      <HealthRecordsTable />
    </div>
  );
};

export default HealthRecordsView;
