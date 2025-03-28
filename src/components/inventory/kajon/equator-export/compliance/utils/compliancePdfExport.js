
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the compliance document template to PDF by capturing the HTML content
 * @param {HTMLElement} templateRef - Reference to the template DOM element
 * @param {string} filename - Name for the downloaded file
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const exportComplianceToPDF = async (templateRef, filename, toast) => {
  try {
    if (!templateRef) {
      throw new Error('Template element not found');
    }

    // Show loading toast
    const loadingToastId = toast?.({
      title: "Processing",
      description: "Generating PDF document...",
      duration: 10000, // 10s
    })?.id;
    
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
    if (loadingToastId && toast) {
      toast({
        id: loadingToastId,
        title: "Success",
        description: "PDF exported successfully",
        duration: 3000,
      });
    } else if (toast) {
      toast({
        title: "Success",
        description: "PDF exported successfully",
        duration: 3000,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error exporting document to PDF:', error);
    toast?.({
      title: "Error",
      description: `Failed to export PDF: ${error.message}`,
      variant: "destructive",
      duration: 5000,
    });
    return false;
  }
};

/**
 * Handles batch export of multiple compliance documents
 * @param {Array} templateRefs - Array of references to template DOM elements
 * @param {Array} filenames - Array of filenames for the downloaded PDFs
 * @param {Function} toast - Toast function for notifications
 * @returns {Promise<boolean>} - Success status of the export
 */
export const batchExportComplianceToPDF = async (templateRefs, filenames, toast) => {
  try {
    if (!templateRefs || templateRefs.length === 0) {
      throw new Error('No templates provided for export');
    }

    // Show loading toast
    const loadingToastId = toast?.({
      title: "Processing",
      description: `Generating ${templateRefs.length} PDF documents...`,
      duration: 30000, // 30s for batch processing
    })?.id;
    
    let successCount = 0;
    
    for (let i = 0; i < templateRefs.length; i++) {
      const templateRef = templateRefs[i];
      const filename = filenames[i] || `compliance-doc-${i+1}`;
      
      try {
        // Temporarily add a class to help with styling during capture
        document.body.classList.add('generating-pdf');
        
        // Configure html2canvas with high quality settings
        const canvas = await html2canvas(templateRef, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: templateRef.scrollWidth,
          windowHeight: templateRef.scrollHeight,
          onclone: (doc) => {
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
        successCount++;
        
      } catch (error) {
        console.error(`Error exporting document ${i+1} to PDF:`, error);
      }
    }
    
    // Dismiss loading toast and show results
    if (loadingToastId && toast) {
      toast({
        id: loadingToastId,
        title: "Export Complete",
        description: `Successfully exported ${successCount} of ${templateRefs.length} documents`,
        duration: 5000,
      });
    } else if (toast) {
      toast({
        title: "Export Complete",
        description: `Successfully exported ${successCount} of ${templateRefs.length} documents`,
        duration: 5000,
      });
    }
    
    return successCount === templateRefs.length;
  } catch (error) {
    console.error('Error in batch export:', error);
    toast?.({
      title: "Error",
      description: `Failed to export PDFs: ${error.message}`,
      variant: "destructive",
      duration: 5000,
    });
    return false;
  }
};
