
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';
import ProductionControls from './components/ProductionControls';
import ProductionTable from './components/ProductionTable';
import { exportToCsv, printRecords } from './utils/exportUtils';

const ProductionLineDataDisplay = ({ productionLine }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const { toast } = useToast();

  const tableName = productionLine.name.toLowerCase().includes('international') 
    ? 'production_line_international' 
    : 'production_line_local';

  const { data: records, isLoading } = useQuery({
    queryKey: [tableName, searchTerm, timeRange],
    queryFn: async () => {
      let query = supabase.from(tableName).select('*');

      if (searchTerm) {
        query = query.or(`batch_id.ilike.%${searchTerm}%,fromager_identifier.ilike.%${searchTerm}%,cheese_type.ilike.%${searchTerm}%`);
      }

      if (timeRange !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case 'day':
            startDate = subDays(now, 1);
            break;
          case 'week':
            startDate = subWeeks(now, 1);
            break;
          case 'month':
            startDate = subMonths(now, 1);
            break;
          case 'year':
            startDate = subYears(now, 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString())
                    .lte('created_at', now.toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleExport = (format) => {
    if (!records?.length) {
      toast({
        title: "Error",
        description: "No records available to export",
        variant: "destructive",
      });
      return;
    }

    if (format === 'print') {
      printRecords(records, productionLine, timeRange);
    } else {
      exportToCsv(records, productionLine, timeRange, toast);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>
          <span>{productionLine.name} Records</span>
        </CardTitle>
        <ProductionControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onExport={handleExport}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <ProductionTable records={records} />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductionLineDataDisplay;
