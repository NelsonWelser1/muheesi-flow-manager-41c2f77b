
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

    // Convert HTML to canvas with higher quality settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    });

    // Calculate dimensions to fit content properly on the page
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate ratio and dimensions
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pageWidth - 20; // Margins
    const imgHeight = imgWidth / ratio;
    
    // Fixed: Proper multi-page handling
    if (imgHeight > pageHeight - 20) {
      // First page
      pdf.addImage(
        imgData,
        "JPEG",
        10, // x position
        10, // y position
        imgWidth,
        imgHeight,
        null,
        'FAST'
      );
      
      // Calculate number of pages needed
      const totalPages = Math.ceil(imgHeight / (pageHeight - 20));
      
      // Add additional pages if needed
      for (let i = 1; i < totalPages; i++) {
        pdf.addPage();
        // Position content to show the next portion on each page
        pdf.addImage(
          imgData,
          "JPEG",
          10, // x position
          -(i * (pageHeight - 20)) + 10, // Offset y position for each page
          imgWidth,
          imgHeight,
          null,
          'FAST'
        );
      }
    } else {
      // Single page - add image centered
      pdf.addImage(
        imgData,
        "JPEG",
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

    // Use html2canvas instead of toPng to avoid CORS issues
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });
    
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    
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
    
    // Improved formatting of contract data for Excel
    const mainInfo = [
      ["LOCAL PURCHASE AGREEMENT"],
      [""],
      ["CONTRACT INFORMATION"],
      [`Contract Number: ${data.contract_number || 'N/A'}`],
      [`Agreement Date: ${data.agreement_date ? format(new Date(data.agreement_date), 'MMMM dd, yyyy') : 'N/A'}`],
      [`Status: ${data.contract_status ? data.contract_status.toUpperCase() : 'DRAFT'}`],
      [""],
      ["BUYER INFORMATION"],
      [`Company: ${data.buyer_name || 'N/A'}`],
      [`Address: ${data.buyer_address || 'N/A'}`],
      [`Contact: ${data.buyer_contact || 'N/A'}`],
      [""],
      ["SUPPLIER INFORMATION"],
      [`Company/Farm/Producer: ${data.supplier_name || 'N/A'}`],
      [`Address: ${data.supplier_address || 'N/A'}`],
      [`Contact: ${data.supplier_contact || 'N/A'}`],
      [""],
      ["CONTRACT TERMS"],
      [`Payment Terms: ${data.payment_terms || 'N/A'}`],
      [`Delivery Terms: ${data.delivery_terms || 'N/A'}`],
      [`Quality Requirements: ${data.quality_requirements || 'N/A'}`],
      [`Special Terms: ${data.special_terms || 'N/A'}`],
      [`Notes: ${data.notes || 'N/A'}`],
    ];
    
    // Create formatted main worksheet
    const wsMain = XLSX.utils.aoa_to_sheet(mainInfo);
    
    // Apply some formatting to the main worksheet
    // Set some column widths
    const mainCols = [{ wch: 40 }]; // Width of first column
    wsMain['!cols'] = mainCols;
    
    // Add main worksheet to workbook
    XLSX.utils.book_append_sheet(wb, wsMain, "Contract Info");
    
    // Create items worksheet if items exist with improved formatting
    if (data.items && data.items.length > 0) {
      // Create proper headers for the items sheet
      const itemsHeader = [["Description", "Variety/Type", "Quantity", "Unit", "Price per Unit (USD)", "Total (USD)"]];
      
      // Format items data properly
      const itemsData = data.items.map(item => [
        item.description || "N/A",
        item.variety || "N/A",
        item.quantity || 0,
        item.unit || "Kg",
        parseFloat(item.unit_price || 0).toFixed(2),
        parseFloat((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)
      ]);
      
      // Calculate total value correctly
      const totalValue = data.items.reduce(
        (total, item) => total + ((item.quantity || 0) * (item.unit_price || 0)), 
        0
      ).toFixed(2);
      
      // Add total row with proper formatting
      itemsData.push(["", "", "", "", "TOTAL", totalValue]);
      
      // Combine header and data
      const itemsSheet = [...itemsHeader, ...itemsData];
      
      // Create items worksheet
      const wsItems = XLSX.utils.aoa_to_sheet(itemsSheet);
      
      // Set column widths for better readability
      const itemsCols = [
        { wch: 30 }, // Description
        { wch: 20 }, // Variety
        { wch: 10 }, // Quantity
        { wch: 10 }, // Unit
        { wch: 18 }, // Price per Unit
        { wch: 15 }  // Total
      ];
      wsItems['!cols'] = itemsCols;
      
      XLSX.utils.book_append_sheet(wb, wsItems, "Items");
    }
    
    // Add a signatures sheet
    const signaturesData = [
      ["SIGNATURES"],
      [""],
      ["For and on behalf of BUYER:"],
      ["Name: ___________________________"],
      ["Signature: ______________________"],
      ["Date: ___________________________"],
      [""],
      ["For and on behalf of SUPPLIER:"],
      ["Name: ___________________________"], 
      ["Signature: ______________________"],
      ["Date: ___________________________"]
    ];
    
    const wsSignatures = XLSX.utils.aoa_to_sheet(signaturesData);
    XLSX.utils.book_append_sheet(wb, wsSignatures, "Signatures");
    
    // Write workbook and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    // Show success toast
    showSuccessToast(toast, "Success", "Excel file exported successfully");
  } catch (error) {
    console.error("Error exporting Excel:", error);
    showErrorToast(toast, "Error", "Failed to export Excel file");
  }
};

