
// Import necessary libraries
import { useToast } from "@/components/ui/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

/**
 * Export a contract to PDF
 * @param {HTMLElement} element - The DOM element to convert to PDF
 * @param {string} filename - The filename to save the PDF as
 * @param {object} toast - The toast function from useToast hook
 * @returns {Promise<void>}
 */
export const exportContractToPDF = async (element, filename, toast) => {
  if (!element) {
    showErrorToast(toast, "Error", "Nothing to export");
    return;
  }

  try {
    // Show loading toast
    showSuccessToast(toast, "Processing", "Generating PDF...");

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    // Create PDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    });

    // Calculate dimensions to fit content on the page
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pageWidth - 20; // Margins
    const imgHeight = imgWidth / ratio;
    
    // Check if the height is greater than page height and handle multiple pages
    if (imgHeight > pageHeight - 20) {
      let position = 0;
      let heightLeft = canvasHeight;
      let pdfPageHeight = pageHeight - 20; // Margins
      
      while (heightLeft > 0) {
        pdf.addPage();
        
        // Add image to page
        pdf.addImage(
          imgData,
          "PNG",
          10, // x position
          10, // y position
          imgWidth,
          imgHeight,
          "",
          "FAST",
          0,
          position / canvasHeight * canvas.height // Crop position
        );
        
        // Move position and reduce height left
        heightLeft -= pdfPageHeight;
        position += pdfPageHeight;
      }
    } else {
      // Single page, add image centered
      pdf.addImage(
        imgData,
        "PNG",
        10, // x position
        10, // y position
        imgWidth,
        imgHeight
      );
    }
    
    // Save PDF
    pdf.save(`${filename}.pdf`);
    
    // Show success toast
    showSuccessToast(toast, "Success", "PDF exported successfully");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    showErrorToast(toast, "Error", "Failed to export PDF");
  }
};

/**
 * Export a contract to JPG
 * @param {HTMLElement} element - The DOM element to convert to JPG
 * @param {string} filename - The filename to save the JPG as
 * @param {object} toast - The toast function from useToast hook
 * @returns {Promise<void>}
 */
export const exportContractToJPG = async (element, filename, toast) => {
  if (!element) {
    showErrorToast(toast, "Error", "Nothing to export");
    return;
  }

  try {
    // Show loading toast
    showSuccessToast(toast, "Processing", "Generating image...");

    const dataUrl = await toPng(element, {
      cacheBust: true,
      quality: 0.95,
      backgroundColor: "#ffffff",
      pixelRatio: 2
    });
    
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.download = `${filename}.jpg`;
    link.href = dataUrl;
    link.click();
    
    // Show success toast
    showSuccessToast(toast, "Success", "Image exported successfully");
  } catch (error) {
    console.error("Error exporting image:", error);
    showErrorToast(toast, "Error", "Failed to export image");
  }
};

/**
 * Export a contract to Excel
 * @param {HTMLElement} element - The DOM element to grab data from (not used directly)
 * @param {object} data - The contract data object
 * @param {string} filename - The filename to save the Excel as
 * @param {object} toast - The toast function from useToast hook
 * @returns {Promise<void>}
 */
export const exportContractToExcel = async (element, data, filename, toast) => {
  try {
    // Show loading toast
    showSuccessToast(toast, "Processing", "Generating Excel file...");

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Format contract data for Excel
    const mainInfo = [
      ["LOCAL PURCHASE AGREEMENT"],
      [`Contract #: ${data.contract_number}`],
      [`Date: ${format(new Date(data.agreement_date), 'MMMM dd, yyyy')}`],
      [""],
      ["BUYER INFORMATION"],
      [`Company: ${data.buyer_name}`],
      [`Address: ${data.buyer_address || "N/A"}`],
      [`Contact: ${data.buyer_contact || "N/A"}`],
      [""],
      ["SUPPLIER INFORMATION"],
      [`Company/Farm/Producer: ${data.supplier_name}`],
      [`Address: ${data.supplier_address || "N/A"}`],
      [`Contact: ${data.supplier_contact || "N/A"}`],
      [""],
      ["CONTRACT TERMS"],
      [`Payment Terms: ${data.payment_terms || "N/A"}`],
      [`Delivery Terms: ${data.delivery_terms || "N/A"}`],
      [`Quality Requirements: ${data.quality_requirements || "N/A"}`],
      [`Special Terms: ${data.special_terms || "N/A"}`],
      [`Notes: ${data.notes || "N/A"}`],
      [`Status: ${data.contract_status || "draft"}`],
    ];
    
    // Create main worksheet
    const wsMain = XLSX.utils.aoa_to_sheet(mainInfo);
    XLSX.utils.book_append_sheet(wb, wsMain, "Contract Info");
    
    // Create items worksheet if items exist
    if (data.items && data.items.length > 0) {
      const itemsHeader = [["Description", "Variety/Type", "Quantity", "Unit", "Price per Unit", "Total"]];
      
      const itemsData = data.items.map(item => [
        item.description || "",
        item.variety || "",
        item.quantity || 0,
        item.unit || "Kg",
        item.unit_price || 0,
        (item.quantity || 0) * (item.unit_price || 0)
      ]);
      
      // Add total row
      const totalValue = data.items.reduce(
        (total, item) => total + ((item.quantity || 0) * (item.unit_price || 0)), 
        0
      );
      
      itemsData.push(["", "", "", "", "TOTAL", totalValue]);
      
      // Combine header and data
      const itemsSheet = [...itemsHeader, ...itemsData];
      
      // Create items worksheet
      const wsItems = XLSX.utils.aoa_to_sheet(itemsSheet);
      XLSX.utils.book_append_sheet(wb, wsItems, "Items");
    }
    
    // Write workbook and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    // Show success toast
    showSuccessToast(toast, "Success", "Excel file exported successfully");
  } catch (error) {
    console.error("Error exporting Excel:", error);
    showErrorToast(toast, "Error", "Failed to export Excel file");
  }
};
