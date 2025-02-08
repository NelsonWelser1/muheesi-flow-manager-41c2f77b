
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const handlePrint = async (formElement, toast) => {
  try {
    const canvas = await html2canvas(formElement);
    const pdf = new jsPDF();
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
    pdf.save('milk-preparation-record.pdf');
    
    toast({
      title: "Success",
      description: "Form printed to PDF successfully",
    });
  } catch (error) {
    console.error('Error printing form:', error);
    toast({
      title: "Error",
      description: "Failed to print form",
      variant: "destructive",
    });
  }
};

export const handleShare = async (toast) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Milk Preparation Record',
        text: 'Yogurt milk preparation process details',
        url: window.location.href
      });
    } else {
      toast({
        title: "Info",
        description: "Sharing not supported on this device",
      });
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
