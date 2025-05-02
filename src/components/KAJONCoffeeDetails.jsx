
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from "@/components/ui/use-toast";
import { Share2, Coffee, TrendingUp, AlertCircle, Calendar, DollarSign } from 'lucide-react';

// Updated data for 2025
const priceData = [
  { name: 'Jan 2024', price: 4200 },
  { name: 'Mar 2024', price: 4600 },
  { name: 'Jun 2024', price: 5100 },
  { name: 'Sep 2024', price: 5500 },
  { name: 'Dec 2024', price: 5750 },
  { name: 'Feb 2025', price: 5950 },
  { name: 'Apr 2025', price: 6250 },
];

const factorData = [
  { name: 'Climate Impact', value: 85 },
  { name: 'Global Demand', value: 78 },
  { name: 'Supply Chain', value: 65 },
  { name: 'Market Trends', value: 72 },
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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" ref={contentRef}>
        <CardHeader className="relative bg-gradient-to-r from-amber-800/90 to-amber-950/95 text-white">
          <div className="absolute inset-0 bg-[url('/combined-logo.png')] bg-center bg-no-repeat bg-contain opacity-10"></div>
          <CardTitle className="text-2xl md:text-3xl font-bold">KAJON Coffee Limited Market Analysis</CardTitle>
          <p className="text-amber-200 mt-2">Premium Coffee Market Insights - April 2025</p>
          <Button onClick={onClose} variant="outline" className="absolute top-2 right-2 bg-white/10 hover:bg-white/20">
            Close
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col items-center">
              <div className="rounded-full bg-amber-100 p-3 mb-2">
                <DollarSign className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">$6,250.00</h3>
              <p className="text-green-600 font-medium">+$300.00 (+5.04%)</p>
              <p className="text-xs text-gray-500 mt-1">Current Price (Apr 2025)</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col items-center">
              <div className="rounded-full bg-amber-100 p-3 mb-2">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">48.8%</h3>
              <p className="text-gray-700">Year-Over-Year Growth</p>
              <p className="text-xs text-gray-500 mt-1">From Apr 2024 to Apr 2025</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex flex-col items-center">
              <div className="rounded-full bg-amber-100 p-3 mb-2">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">$6,750</h3>
              <p className="text-gray-700">Projected Jul 2025</p>
              <p className="text-xs text-gray-500 mt-1">Estimated Future Price</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border mb-6">
            <h3 className="text-lg font-semibold mb-4 text-amber-800 flex items-center">
              <Coffee className="h-5 w-5 mr-2" /> Price Trend (2024-2025)
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#666" 
                    tick={{ fill: '#666' }} 
                    tickLine={{ stroke: '#666' }}
                  />
                  <YAxis 
                    stroke="#666" 
                    tick={{ fill: '#666' }} 
                    tickLine={{ stroke: '#666' }}
                    tickFormatter={(value) => `$${value}`}
                    domain={['dataMin - 500', 'dataMax + 500']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}
                    labelStyle={{ color: '#333', fontWeight: 'bold' }}
                    formatter={(value) => [`$${value}`, 'Price']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#d97706" 
                    strokeWidth={3} 
                    dot={{ fill: '#d97706', stroke: '#d97706', strokeWidth: 2, r: 5 }} 
                    activeDot={{ r: 8, fill: '#92400e' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Market Analysis
              </h3>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="mb-2"><strong>Strong Upward Trend (2025):</strong> Coffee prices have demonstrated robust growth in early 2025, with premium Arabica and specialty coffees showing particularly strong performance.</p>
                <p><strong>Current Price Level:</strong> At $6,250 per metric ton, prices have reached a 4-year high driven by increased global demand and supply constraints in key producing regions.</p>
              </div>

              <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2" /> Price Projections
              </h3>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="mb-2"><strong>May-June 2025:</strong> Expecting continued growth reaching approximately $6,500 as summer demand increases and supply remains constrained.</p>
                <p><strong>July-August 2025:</strong> Prices projected to stabilize around $6,750 with potential for higher peaks if weather disruptions affect major growing regions.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" /> Market Factors
              </h3>
              
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Climate Patterns:</strong> Extreme weather in Brazil and Vietnam affecting production yields.</li>
                  <li><strong>Rising Consumption:</strong> Post-pandemic surge in premium coffee consumption in Asian markets.</li>
                  <li><strong>Supply Chain:</strong> Ongoing logistics challenges and increasing shipping costs.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button onClick={printAsPDF} className="bg-amber-700 hover:bg-amber-800">Print as PDF</Button>
            <Button onClick={saveAsJPEG} className="bg-amber-700 hover:bg-amber-800">Save as JPEG</Button>
            <Button onClick={shareContent} className="bg-amber-700 hover:bg-amber-800"><Share2 className="mr-2" />Share</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeDetails;
