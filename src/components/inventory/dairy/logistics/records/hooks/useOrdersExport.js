
import { useToast } from "@/components/ui/use-toast";
import { exportToCSV, exportToExcel, exportToPDF } from "../utils/exportUtils";

const useOrdersExport = (orders) => {
  const { toast } = useToast();

  const handleExportToCSV = () => {
    try {
      exportToCSV(orders, 'logistics_orders');
      toast({
        title: "Export Successful",
        description: "Orders data has been exported to CSV.",
      });
    } catch (error) {
      console.error("CSV Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export orders data to CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      exportToExcel(orders, 'logistics_orders');
      toast({
        title: "Export Successful",
        description: "Orders data has been exported to Excel.",
      });
    } catch (error) {
      console.error("Excel Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export orders data to Excel.",
        variant: "destructive",
      });
    }
  };

  const handleExportToPDF = () => {
    try {
      exportToPDF(orders, 'Logistics Orders Records');
      toast({
        title: "Export Successful",
        description: "Orders data has been exported to PDF.",
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export orders data to PDF.",
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

export default useOrdersExport;
