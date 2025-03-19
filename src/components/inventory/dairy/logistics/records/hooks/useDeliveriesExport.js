
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from "../utils/exportUtils";

const useDeliveriesExport = (deliveries) => {
  const { toast } = useToast();

  const handleExportToCSV = () => {
    try {
      exportToCSV(deliveries, 'logistics_deliveries');
      toast({
        title: "Export Successful",
        description: "Deliveries data has been exported to CSV.",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export deliveries data to CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(deliveries, 'logistics_deliveries');
      toast({
        title: "Export Successful",
        description: "Deliveries data has been exported to Excel.",
      });
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export deliveries data to Excel.",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = () => {
    try {
      exportToPDF(deliveries, 'Logistics Deliveries Records');
      toast({
        title: "Export Successful",
        description: "Deliveries data has been exported to PDF.",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export deliveries data to PDF.",
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

export default useDeliveriesExport;
