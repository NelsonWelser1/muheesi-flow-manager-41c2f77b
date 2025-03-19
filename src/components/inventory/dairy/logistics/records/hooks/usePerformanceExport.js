
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from "../utils/exportUtils";

const usePerformanceExport = (performance) => {
  const { toast } = useToast();

  const handleExportToCSV = () => {
    try {
      exportToCSV(performance, 'logistics_performance');
      toast({
        title: "Export Successful",
        description: "Performance data has been exported to CSV.",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export performance data to CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(performance, 'logistics_performance');
      toast({
        title: "Export Successful",
        description: "Performance data has been exported to Excel.",
      });
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export performance data to Excel.",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = () => {
    try {
      exportToPDF(performance, 'Logistics Performance Records');
      toast({
        title: "Export Successful",
        description: "Performance data has been exported to PDF.",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export performance data to PDF.",
        variant: "destructive",
      });
    }
  };

  return {
    exportToCSV: handleExportToCSV,
    exportToExcel: handleExportToExcel,
    exportToPDF: handleExportToPDF,
  };
};

export default usePerformanceExport;
