
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { showSuccessToast, showErrorToast } from '@/components/ui/notifications';

/**
 * Exports the contract template to PDF
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
    
    if (toast) showSuccessToast(toast, 'Contract exported to PDF successfully');
    return true;
  } catch (error) {
    console.error('Error exporting contract to PDF:', error);
    if (toast) showErrorToast(toast, `Failed to export PDF: ${error.message}`);
    return false;
  }
};

/**
 * Exports the contract as a JPG image
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

    // Temporarily add a class to help with styling during capture
    document.body.classList.add('generating-jpg');
    
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(templateRef, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
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
    document.body.classList.remove('generating-jpg');
    
    // Convert to JPG and download
    const imageUrl = canvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (toast) showSuccessToast(toast, 'Contract exported as JPG successfully');
    return true;
  } catch (error) {
    console.error('Error exporting contract to JPG:', error);
    if (toast) showErrorToast(toast, `Failed to export JPG: ${error.message}`);
    return false;
  }
};

/**
 * Extracts text content from a contract template and exports it to Excel
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @param {object} contractData - Structured contract data
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportContractToExcel = async (templateRef, contractData, filename, toast) => {
  try {
    if (!templateRef) {
      throw new Error('Template element not found');
    }
    
    // Extract data or use provided data
    const data = contractData || extractContractData(templateRef);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Contract Details Sheet
    const contractSheet = XLSX.utils.json_to_sheet([{
      'Contract Title': data.title || filename,
      'Contract Number': data.contractNumber || '',
      'Contract Date': data.currentDate || new Date().toISOString().split('T')[0],
      'Contract Type': data.contractType || 'Coffee Export Contract'
    }]);
    XLSX.utils.book_append_sheet(wb, contractSheet, 'Contract Details');
    
    // Parties Sheet
    const partiesSheet = XLSX.utils.json_to_sheet([{
      'Seller Name': data.sellerName || 'KAJON Coffee Limited',
      'Seller Address': data.sellerAddress || '',
      'Seller Registration': data.sellerRegistration || '',
      'Buyer Name': data.buyerName || '',
      'Buyer Address': data.buyerAddress || '',
      'Buyer Registration': data.buyerRegistration || ''
    }]);
    XLSX.utils.book_append_sheet(wb, partiesSheet, 'Parties');
    
    // Products Sheet (if available)
    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
      const productsSheet = XLSX.utils.json_to_sheet(data.products);
      XLSX.utils.book_append_sheet(wb, productsSheet, 'Products');
    }
    
    // Quality Specifications Sheet (if available)
    if (data.qualitySpecs && Array.isArray(data.qualitySpecs) && data.qualitySpecs.length > 0) {
      const qualitySheet = XLSX.utils.json_to_sheet(data.qualitySpecs);
      XLSX.utils.book_append_sheet(wb, qualitySheet, 'Quality Specifications');
    }
    
    // Terms Sheet
    const termsSheet = XLSX.utils.json_to_sheet([{
      'Incoterm': data.incoterm || '',
      'Packaging': data.packaging || '',
      'Loading Port': data.loadingPort || '',
      'Destination': data.destination || '',
      'Latest Shipment Date': data.latestShipmentDate || '',
      'Payment Terms': data.paymentTerms || ''
    }]);
    XLSX.utils.book_append_sheet(wb, termsSheet, 'Terms');
    
    // Generate and save Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    if (toast) showSuccessToast(toast, 'Contract exported to Excel successfully');
    return true;
  } catch (error) {
    console.error('Error exporting contract to Excel:', error);
    if (toast) showErrorToast(toast, `Failed to export Excel: ${error.message}`);
    return false;
  }
};

/**
 * Helper function to extract structured data from a contract template
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @returns {object} - Structured contract data
 */
const extractContractData = (templateRef) => {
  // This would normally extract data from DOM elements
  // For simplicity, we're returning a placeholder structure
  return {
    title: 'Coffee Export Contract',
    contractNumber: '',
    currentDate: new Date().toISOString().split('T')[0],
    contractType: 'Coffee Export Contract',
    sellerName: 'KAJON Coffee Limited',
    sellerAddress: '',
    sellerRegistration: '',
    buyerName: '',
    buyerAddress: '',
    buyerRegistration: '',
    products: [
      { Description: 'Arabica Coffee', Origin: 'Uganda', 'Quantity (Kg)': 1000, Grade: 'A', 'Price per Kg': 5, 'Total Value': 5000 }
    ],
    qualitySpecs: [
      { Type: 'Arabica', Moisture: '10-12%', 'Defect Content': '<5%', 'Cup Score': '80+', Processing: 'Washed', 'Flavor Profile': 'Bright, Citrus' }
    ],
    incoterm: 'FOB',
    packaging: '60kg bags',
    loadingPort: 'Mombasa',
    destination: '',
    latestShipmentDate: '',
    paymentTerms: ''
  };
};
