
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import QualityChecksHeader from './QualityChecksHeader';
import QualityChecksTable from './QualityChecksTable';
import QualityChecksPagination from './QualityChecksPagination';
import { useQualityChecksExport } from '../hooks/useQualityChecksExport';

const RECORDS_PER_PAGE = 10;

const QualityChecksDisplay = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { handleExportPDF, handleExportExcel, handleExportCSV, handlePrint } = useQualityChecksExport();

  const {
    data: qualityChecks,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['qualityChecks'],
    queryFn: async () => {
      console.log('Fetching quality control data');
      const { data, error } = await supabase
        .from('quality_checks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching quality control data:', error);
        throw error;
      }
      console.log('Quality control data:', data);
      return data;
    }
  });

  // Filter checks based on search term
  const filteredChecks = qualityChecks?.filter(check =>
    check.batch_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.temperature_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.ph_level_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.moisture_content_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.fat_content_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.protein_content_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.salt_content_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredChecks.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentChecks = filteredChecks.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Quality control checks have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading quality control checks...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Error loading checks: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <QualityChecksHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={handleRefresh}
        onPrint={() => handlePrint()}
        onExportPDF={() => handleExportPDF(filteredChecks)}
        onExportExcel={() => handleExportExcel(filteredChecks)}
        onExportCSV={() => handleExportCSV(filteredChecks)}
        isRefreshing={isRefreshing}
      />
      <CardContent>
        {filteredChecks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {searchTerm ? 'No checks found matching your search.' : 'No quality control checks found.'}
          </div>
        ) : (
          <>
            <QualityChecksTable checks={currentChecks} />
            <QualityChecksPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalRecords={filteredChecks.length}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default QualityChecksDisplay;
