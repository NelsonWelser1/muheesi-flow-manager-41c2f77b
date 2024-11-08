import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');
  const [logo, setLogo] = useState(null);
  const fileInputRef = useRef(null);
  const addStockMutation = useAddKAJONCoffeeLimited();

  const currentUser = {
    name: "Nelson Welser",
    authorizedLocations: ["Kampala Store", "Mbarara Warehouse", "Kakyinga Factory"]
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        toast({
          title: "Logo Updated",
          description: "Company logo has been successfully updated",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    setSelectedInterface(null);
    setSelectedAction(null);
    setVerificationStep(false);
    setPin('');
  };

  if (!selectedInterface) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>KAJON Coffee Limited</CardTitle>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {logo ? (
                  <img src={logo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
              onClick={() => setSelectedInterface('kajon')}
            >
              Update KAJON Coffee Limited Stock
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg font-semibold"
              onClick={() => setSelectedInterface('kazo')}
            >
              Update Kazo Coffee Development Project Stock
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            {selectedInterface === 'kajon' ? 'Stock Update' : 'Kazo Coffee Development Project'}
          </CardTitle>
          <Button variant="ghost" onClick={handleBack} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {selectedInterface === 'kajon' ? (
            !selectedAction ? (
              <StockUpdateForm
                currentUser={currentUser}
                verificationStep={verificationStep}
                pin={pin}
                onPinChange={setPin}
                onBack={() => setVerificationStep(false)}
                actionType={selectedAction}
              />
            ) : (
              <StockSummary stock={currentStock} />
            )
          ) : (
            <KazoCoffeeProject />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KAJONCoffeeLimited;