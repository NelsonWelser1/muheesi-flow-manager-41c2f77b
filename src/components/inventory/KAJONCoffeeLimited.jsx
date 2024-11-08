import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, LogOut, Clock } from 'lucide-react';
import StockUpdateForm from './kajon/StockUpdateForm';
import StockSummary from './kajon/StockSummary';
import KazoCoffeeProject from './kajon/KazoCoffeeProject';
import { format } from 'date-fns';

const KAJONCoffeeLimited = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedInterface, setSelectedInterface] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pin, setPin] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const currentUser = {
    name: "Nelson Welser",
    role: "Inventory Manager"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack} className="p-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Companies
              </Button>
              <h1 className="text-2xl font-bold">KAJON Coffee Limited</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="font-semibold">{currentUser.name}</div>
                <div className="text-sm text-muted-foreground">{currentUser.role}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <Clock className="inline-block mr-2" />
                {format(new Date(), 'MMM d, yyyy, h:mm:ss a')}
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = 'https://lov-p-343a8d2e-efae-497c-8ac5-1f04f7962234.fly.dev/'}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/logout')}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6">
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

        {selectedInterface && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                {selectedInterface === 'kajon' ? 'Stock Update' : 'Kazo Coffee Development Project'}
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedInterface(null)} className="h-8 w-8 p-0">
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
        )}
      </div>
    </div>
  );
};

export default KAJONCoffeeLimited;