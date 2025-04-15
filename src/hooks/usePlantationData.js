
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const usePlantationData = (farmId = 'kashari') => {
  const [cropsData, setCropsData] = useState([]);
  const [workersData, setWorkersData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch crops data
        const { data: crops, error: cropsError } = await supabase
          .from('plantation_crops')
          .select('*')
          .eq('farm_id', farmId);

        if (cropsError) throw cropsError;
        setCropsData(crops || []);

        // Fetch workers data
        const { data: workers, error: workersError } = await supabase
          .from('plantation_workers')
          .select('*')
          .eq('farm_id', farmId);

        if (workersError) throw workersError;
        setWorkersData(workers || []);

        // Fetch equipment data
        const { data: equipment, error: equipmentError } = await supabase
          .from('plantation_equipment')
          .select('*')
          .eq('farm_id', farmId);

        if (equipmentError) throw equipmentError;
        setEquipmentData(equipment || []);

      } catch (err) {
        console.error('Error fetching plantation data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  return {
    cropsData,
    workersData,
    equipmentData,
    loading,
    error
  };
};
