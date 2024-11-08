import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, Home, LogOut, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { useAddKAJONCoffeeLimited } from '@/integrations/supabase/hooks/useKAJONCoffeeLimited';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
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
    role: "Inventory Manager",
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-futuristic">
            Muheesi GKK Integrated System
          </Link>
          <div className="flex space-x-4">
            <Button variant="outline" className="text-white">Dashboard</Button>
            <Button variant="outline" className="text-white">Manage Inventory</Button>
            <Button variant="outline" className="text-white">Manage Companies</Button>
            <Button variant="outline" className="text-white">Feedback</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            <h1 className="text-2xl font-bold">KAJON Coffee Limited</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="font-semibold">{currentUser.name}</div>
              <div className="text-sm text-gray-600">{currentUser.role}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/home">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg"
              onClick={() => setSelectedInterface('kajon')}
            >
              Update KAJON Coffee Limited Stock
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left h-auto py-4 text-lg"
              onClick={() => setSelectedInterface('kazo')}
            >
              Update Kazo Coffee Development Project Stock
            </Button>
          </CardContent>
        </Card>

        {selectedInterface && (
          <div className="space-y-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default KAJONCoffeeLimited;