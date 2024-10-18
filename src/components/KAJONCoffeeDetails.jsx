import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from 'lucide-react';

const data = [
  { name: 'Nov 2023', price: 2500 },
  { name: 'Jan 2024', price: 3000 },
  { name: 'Apr 2024', price: 3500 },
  { name: 'Jun 2024', price: 4000 },
  { name: 'Sept 2024', price: 5200 },
  { name: 'Oct 2024', price: 4924 },
];

const KAJONCoffeeDetails = ({ onClose }) => {
  const { toast } = useToast();
  const contentRef = useRef(null);

  const captureContent = () => {
    return html2canvas(contentRef.current);
  };

  const printAsPDF = async () => {
    const canvas = await captureContent();
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("KAJON_Coffee_Analysis.pdf");
    toast({
      title: "PDF Generated",
      description: "The analysis has been saved as a PDF.",
    });
  };

  const saveAsJPEG = async () => {
    const canvas = await captureContent();
    const link = document.createElement('a');
    link.download = 'KAJON_Coffee_Analysis.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
    toast({
      title: "JPEG Saved",
      description: "The analysis has been saved as a JPEG image.",
    });
  };

  const shareContent = async () => {
    const canvas = await captureContent();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const file = new File([blob], 'KAJON_Coffee_Analysis.jpg', { type: 'image/jpeg' });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KAJON Coffee Market Analysis',
          text: 'Check out this coffee market analysis from KAJON Coffee Limited!',
          files: [file],
        });
        toast({
          title: "Shared Successfully",
          description: "The analysis has been shared.",
        });
      } catch (error) {
        console.error('Error sharing', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent('Check out this coffee market analysis from KAJON Coffee Limited!');
    const shareOptions = [
      { name: 'WhatsApp', url: `https://wa.me/?text=${shareText}%20${shareUrl}` },
      { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
      { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
      { name: 'LinkedIn', url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}` },
      { name: 'Email', url: `mailto:?subject=KAJON Coffee Market Analysis&body=${shareText}%20${shareUrl}` },
    ];
    
    const shareLinks = shareOptions.map(option => 
      `<a href="${option.url}" target="_blank" rel="noopener noreferrer" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${option.name}</a>`
    ).join('');

    const shareMenu = document.createElement('div');
    shareMenu.innerHTML = `
      <div class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          ${shareLinks}
        </div>
      </div>
    `;
    shareMenu.style.position = 'fixed';
    shareMenu.style.top = '50%';
    shareMenu.style.left = '50%';
    shareMenu.style.transform = 'translate(-50%, -50%)';
    shareMenu.style.zIndex = '1000';

    document.body.appendChild(shareMenu);

    const closeMenu = (e) => {
      if (!shareMenu.contains(e.target)) {
        document.body.removeChild(shareMenu);
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" ref={contentRef}>
        <CardHeader>
          <CardTitle>KAJON Coffee Limited Market Analysis</CardTitle>
          <Button onClick={onClose} variant="outline" className="absolute top-2 right-2">
            Close
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Current Price: 4,924.00 USD</h3>
            <p className="text-red-500">-34.00 (-0.69%)</p>
          </div>
          <div className="h-[300px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis 
                  dataKey="name" 
                  stroke="#333" 
                  tick={{ fill: '#333' }} 
                  tickLine={{ stroke: '#333' }}
                />
                <YAxis 
                  stroke="#333" 
                  tick={{ fill: '#333' }} 
                  tickLine={{ stroke: '#333' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                  labelStyle={{ color: '#333' }}
                  itemStyle={{ color: '#333' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#ff4136" 
                  strokeWidth={2} 
                  dot={{ fill: '#ff4136', stroke: '#ff4136', strokeWidth: 2 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Analysis:</h3>
            <p>1. <strong>Recent Peak (Sept 2024)</strong>: The price showed a strong upward trend throughout the year, with a significant peak around September 2024, possibly due to seasonal factors, supply disruptions, or increased global demand for coffee.</p>
            <p>2. <strong>Current Price (Oct 2024)</strong>: The chart suggests that after hitting a high, the price has declined slightly to 4,924.00 USD by mid-October. This could indicate market corrections, increased supply, or decreased demand affecting prices.</p>
            
            <h3 className="text-xl font-semibold">Price Projections:</h3>
            <p>1. <strong>October 2024</strong>: Given that the price is currently on a slight decline after peaking, it is possible that the market will experience mild corrections for the rest of October, stabilizing around the current level of 4,900-5,000 USD, especially as supply adjusts to meet demand after the earlier peak.</p>
            <p>2. <strong>November 2024</strong>: Heading into November, coffee prices may experience seasonal demand due to the upcoming holiday season in Western markets, which typically drives higher consumption. Prices could potentially rebound to around 5,000-5,100 USD if demand increases, but it will also depend on supply-side factors such as crop yields and export capacities, especially from major coffee-producing regions.</p>
            
            <h3 className="text-xl font-semibold">Factors to Watch:</h3>
            <ul className="list-disc pl-5">
              <li><strong>Global Coffee Demand</strong>: The holiday season could boost demand and push prices higher.</li>
              <li><strong>Supply Chain</strong>: If supply issues such as unfavorable weather, logistical bottlenecks, or political events disrupt coffee production in key regions, prices could rise.</li>
              <li><strong>Market Corrections</strong>: The slight drop observed in mid-October might suggest temporary overvaluation, and the market could stabilize or decline slightly if supply outpaces demand.</li>
            </ul>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={printAsPDF}>Print as PDF</Button>
            <Button onClick={saveAsJPEG}>Save as JPEG</Button>
            <Button onClick={shareContent}><Share2 className="mr-2" />Share</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeDetails;