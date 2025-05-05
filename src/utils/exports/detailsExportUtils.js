
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";

/**
 * Exports company details modal content to an image or PDF
 * @param {string} elementSelector - CSS selector for the element to export
 * @param {string} filename - Base filename for the export
 * @param {string} format - Export format ('jpg' or 'pdf')
 * @param {Function} toast - Toast function for notifications (optional)
 * @returns {Promise<boolean>} - Success status
 */
export const exportCompanyDetails = async (elementSelector, filename, format = 'pdf', toast) => {
  try {
    const element = document.querySelector(elementSelector);
    if (!element) {
      showErrorToast(toast, "Export Error", "Could not find content to export");
      return false;
    }
    
    // Show loading notification
    const loadingToast = showSuccessToast(toast, "Processing", `Generating ${format.toUpperCase()}...`);
    
    // Add padding to ensure we capture all content with proper spacing
    const originalPadding = element.style.padding;
    element.style.padding = '24px';
    
    // Configure html2canvas with high quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      x: 0,
      y: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (doc) => {
        // Make sure cloned element also has padding
        const clonedElement = doc.querySelector(elementSelector);
        if (clonedElement) {
          clonedElement.style.padding = '24px';
        }
      }
    });
    
    // Reset original padding
    element.style.padding = originalPadding;
    
    // Format date for filename
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    
    if (format === 'jpg') {
      // Export as JPG
      const link = document.createElement('a');
      link.download = `${filename}-${dateStr}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.92);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export as PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'mm',
      });
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // 10mm margins
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 10, 10, pdfWidth, pdfHeight);
      pdf.save(`${filename}-${dateStr}.pdf`);
    }
    
    // Show success notification
    showSuccessToast(toast, "Export Successful", 
      `${format === 'jpg' ? 'Image' : 'PDF'} has been created successfully`);
    
    return true;
  } catch (error) {
    console.error('Export error:', error);
    showErrorToast(toast, "Export Failed", error.message || "Failed to generate export");
    return false;
  }
};

/**
 * Share company details as an image via the Web Share API
 * @param {string} elementSelector - CSS selector for the element to share
 * @param {string} title - Title for the share dialog
 * @param {string} text - Text description for the share dialog
 * @param {Function} toast - Toast function for notifications (optional)
 * @returns {Promise<boolean>} - Success status
 */
export const shareCompanyDetails = async (elementSelector, title, text, toast) => {
  try {
    // Check if Web Share API is available
    if (!navigator.share) {
      showErrorToast(toast, "Share Error", "Web Share API is not supported in your browser");
      return false;
    }
    
    const element = document.querySelector(elementSelector);
    if (!element) {
      showErrorToast(toast, "Share Error", "Could not find content to share");
      return false;
    }
    
    // Show loading notification
    const loadingToast = showSuccessToast(toast, "Processing", "Preparing content for sharing...");
    
    // Add padding to ensure we capture all content with proper spacing
    const originalPadding = element.style.padding;
    element.style.padding = '24px';
    
    // Create high-quality image
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Reset original padding
    element.style.padding = originalPadding;
    
    // Convert canvas to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    
    // Create file from blob
    const file = new File([blob], 'company-details.jpg', { type: 'image/jpeg' });
    
    // Share the file
    await navigator.share({
      title: title,
      text: text,
      files: [file]
    });
    
    showSuccessToast(toast, "Share Successful", "Content shared successfully");
    return true;
  } catch (error) {
    console.error('Share error:', error);
    // Don't show error for user cancellation
    if (error.name !== 'AbortError') {
      showErrorToast(toast, "Share Failed", error.message || "Failed to share content");
    }
    return false;
  }
};
