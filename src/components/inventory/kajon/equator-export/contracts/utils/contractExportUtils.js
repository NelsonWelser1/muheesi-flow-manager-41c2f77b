
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';
import { format } from 'date-fns';

/**
 * Exports the contract template to PDF by capturing the HTML content
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportContractToPDF = async (templateRef, filename, toast) => {
  try {
    if (!templateRef) {
      throw new Error('Template element not found');
    }

    // Show loading toast
    const loadingToast = showLoadingToast(toast, 'Generating PDF...');
    
    // Temporarily add a class to help with styling during capture
    document.body.classList.add('generating-pdf');
    
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(templateRef, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: templateRef.scrollWidth,
      windowHeight: templateRef.scrollHeight,
      onclone: (doc) => {
        // Apply print-specific styling to the cloned document
        const element = doc.body.querySelector('.print-container');
        if (element) {
          element.style.padding = '0';
          element.style.margin = '0 auto';
          element.style.border = 'none';
          element.style.boxShadow = 'none';
        }
      }
    });
    
    // Remove the temporary class
    document.body.classList.remove('generating-pdf');
    
    // Create PDF with appropriate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if the content doesn't fit on one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    // Dismiss loading toast and show success
    if (loadingToast) dismissToast(loadingToast);
    showSuccessToast(toast, 'PDF exported successfully');
    
    return true;
  } catch (error) {
    console.error('Error exporting contract to PDF:', error);
    showErrorToast(toast, `Failed to export PDF: ${error.message}`);
    return false;
  }
};

/**
 * Exports the contract template to JPG by capturing the HTML content
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportContractToJPG = async (templateRef, filename, toast) => {
  try {
    if (!templateRef) {
      throw new Error('Template element not found');
    }

    // Show loading toast
    const loadingToast = showLoadingToast(toast, 'Generating Image...');
    
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(templateRef, {
      scale: 3, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Dismiss loading toast and show success
    if (loadingToast) dismissToast(loadingToast);
    showSuccessToast(toast, 'Image exported successfully');
    
    return true;
  } catch (error) {
    console.error('Error exporting contract to JPG:', error);
    showErrorToast(toast, `Failed to export JPG: ${error.message}`);
    return false;
  }
};

/**
 * Exports the contract data to Excel
 * @param {HTMLElement} templateRef - Reference to the template DOM element (not used, kept for consistency)
 * @param {Object} contractData - The contract data object
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportContractToExcel = async (templateRef, contractData, filename, toast) => {
  try {
    if (!contractData) {
      throw new Error('Contract data not provided');
    }

    // Show loading toast
    const loadingToast = showLoadingToast(toast, 'Generating Excel file...');
    
    // Determine the type of contract based on the data structure
    let worksheets = [];
    
    // Check if it's a local purchase agreement
    if (contractData.items && Array.isArray(contractData.items)) {
      // Local Purchase Agreement format
      worksheets = [
        {
          name: 'Contract Details',
          data: [
            ['Contract Number', contractData.contract_number || ''],
            ['Date', format(new Date(contractData.agreement_date || new Date()), 'yyyy-MM-dd')],
            ['Status', contractData.contract_status || 'draft'],
            ['Buyer', contractData.buyer_name || ''],
            ['Buyer Address', contractData.buyer_address || ''],
            ['Buyer Contact', contractData.buyer_contact || ''],
            ['Supplier', contractData.supplier_name || ''],
            ['Supplier Address', contractData.supplier_address || ''],
            ['Supplier Contact', contractData.supplier_contact || ''],
            ['Payment Terms', contractData.payment_terms || ''],
            ['Delivery Terms', contractData.delivery_terms || ''],
            ['Quality Requirements', contractData.quality_requirements || ''],
            ['Special Terms', contractData.special_terms || ''],
            ['Notes', contractData.notes || ''],
            ['Total Value', parseFloat(contractData.total_value || '0').toFixed(2)]
          ]
        },
        {
          name: 'Items',
          data: [
            ['Description', 'Variety/Type', 'Quantity', 'Unit', 'Price per Unit', 'Total Value'],
            ...contractData.items.map(item => [
              item.description || '',
              item.variety || '',
              parseFloat(item.quantity || '0').toString(),
              item.unit || 'Kg',
              parseFloat(item.unit_price || '0').toFixed(2),
              (parseFloat(item.quantity || '0') * parseFloat(item.unit_price || '0')).toFixed(2)
            ])
          ]
        }
      ];
    } else if (contractData.product_details && Array.isArray(contractData.product_details)) {
      // Export contract format (from coffee contract templates)
      worksheets = [
        {
          name: 'Contract Details',
          data: [
            ['Contract Number', contractData.contract_number || ''],
            ['Date', format(new Date(contractData.contract_date || new Date()), 'yyyy-MM-dd')],
            ['Buyer', contractData.buyer_name || ''],
            ['Buyer Address', contractData.buyer_address || ''],
            ['Seller', contractData.seller_name || ''],
            ['Seller Address', contractData.seller_address || ''],
            ['Incoterm', contractData.incoterm || ''],
            ['Loading Port', contractData.loading_port || ''],
            ['Destination', contractData.destination || ''],
            ['Latest Shipment', contractData.latest_shipment || ''],
            ['Payment Terms', contractData.payment_terms || ''],
            ['Additional Terms', contractData.additional_terms || '']
          ]
        },
        {
          name: 'Products',
          data: [
            ['Description', 'Origin', 'Quantity (Kg)', 'Grade', 'Price per Kg', 'Total Value'],
            ...contractData.product_details.map(product => [
              product.description || '',
              product.origin || '',
              parseFloat(product.quantity || '0').toString(),
              product.grade || '',
              parseFloat(product.price_per_kg || '0').toFixed(2),
              parseFloat(product.total_value || '0').toFixed(2)
            ])
          ]
        }
      ];
      
      // Add quality specifications if available
      if (contractData.quality_specs && Array.isArray(contractData.quality_specs)) {
        worksheets.push({
          name: 'Quality Specifications',
          data: [
            ['Type', 'Moisture', 'Defect Content', 'Cup Score', 'Processing', 'Flavor Profile'],
            ...contractData.quality_specs.map(spec => [
              spec.type || '',
              spec.moisture || '',
              spec.defect_content || '',
              spec.cup_score || '',
              spec.processing || '',
              spec.flavor_profile || ''
            ])
          ]
        });
      }
    } else {
      // Generic fallback format
      const data = [];
      for (const [key, value] of Object.entries(contractData)) {
        if (typeof value !== 'object') {
          data.push([key, value]);
        }
      }
      worksheets = [{ name: 'Contract', data }];
    }
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add each worksheet to the workbook
    worksheets.forEach(sheet => {
      const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    // Dismiss loading toast and show success
    if (loadingToast) dismissToast(loadingToast);
    showSuccessToast(toast, 'Excel file exported successfully');
    
    return true;
  } catch (error) {
    console.error('Error exporting contract to Excel:', error);
    showErrorToast(toast, `Failed to export Excel: ${error.message}`);
    return false;
  }
};

// Helper function for a loading toast
const showLoadingToast = (toast, message) => {
  if (toast) {
    return toast({
      title: "Processing",
      description: message,
      duration: 10000, // 10s
    });
  }
  return null;
};

// Helper function to dismiss a toast
const dismissToast = (toastId) => {
  if (toastId) {
    return { id: toastId };
  }
};

// Attempt to create notification functions if not available
const defaultNotifications = {
  showSuccessToast: (toast, message) => {
    if (toast) {
      toast({
        title: "Success",
        description: message,
        duration: 3000,
      });
    } else {
      console.log('Success:', message);
    }
  },
  showErrorToast: (toast, message) => {
    if (toast) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      console.error('Error:', message);
    }
  }
};

// Export default notification functions
export const showSuccessToast = (toast, message) => {
  try {
    if (typeof window.showSuccessToast === 'function') {
      return window.showSuccessToast(toast, message);
    } else {
      return defaultNotifications.showSuccessToast(toast, message);
    }
  } catch (e) {
    return defaultNotifications.showSuccessToast(toast, message);
  }
};

export const showErrorToast = (toast, message) => {
  try {
    if (typeof window.showErrorToast === 'function') {
      return window.showErrorToast(toast, message);
    } else {
      return defaultNotifications.showErrorToast(toast, message);
    }
  } catch (e) {
    return defaultNotifications.showErrorToast(toast, message);
  }
};
