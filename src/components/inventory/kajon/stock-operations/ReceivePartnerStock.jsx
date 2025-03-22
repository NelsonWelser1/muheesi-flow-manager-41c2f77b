
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Inbox, RefreshCw, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useCoffeeStockTransfers } from '@/hooks/useCoffeeStockTransfers';
import { showSuccessToast, showErrorToast } from "@/components/ui/notifications";
import AuthenticationForm from '../AuthenticationForm';
import PendingTransfers from './PendingTransfers';
import CoffeeRelocationRecords from './records/CoffeeRelocationRecords';

const STORE_LOCATIONS = {
  kazo: [
    "Kanoni-Mbogo",
    "Kanoni-Rwakahaya",
    "Engari-Kaichumu",
    "Engari-Kyengando",
    "Migina",
    "Kagarama",
    "Kyampangara",
    "Nkungu",
    "Buremba",
    "Kazo Town council",
    "Burunga",
    "Rwemikoma"
  ],
  regular: [
    "Kampala",
    "JBER",
    "Mbarara",
    "Kakyinga",
    "Kazo-Kanoni",
    "Kazo"
  ]
};

const ReceivePartnerStock = ({ isKazo }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [viewRecords, setViewRecords] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();
  const { handleRefresh } = useCoffeeStockTransfers();

  const handleAuthentication = (name, location) => {
    setManagerName(name);
    setIsAuthenticated(true);
  };

  const handleRefreshTransfers = () => {
    handleRefresh();
    showSuccessToast(toast, "Transfer list refreshed");
  };

  if (viewRecords) {
    return (
      <div className="space-y-4">
        <CoffeeRelocationRecords onBack={() => setViewRecords(false)} isKazo={isKazo} />
      </div>
    );
  }

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Receive Partner Stock</h2>
        </div>
        <Label>Select Your Location</Label>
        <Select onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {isKazo 
              ? STORE_LOCATIONS.kazo.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
              : STORE_LOCATIONS.regular.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))
            }
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Receive Partner Stock</h2>
        </div>
        <AuthenticationForm 
          onAuthenticate={handleAuthentication}
          title={isKazo ? "Store Manager Name" : "Warehouse Manager Name"}
          selectedLocation={selectedLocation}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Receive Partner Stock</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshTransfers} 
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewRecords(true)} 
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> View Records
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-600" /> Stock Transfer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Inbox className="h-5 w-5 text-amber-600 mt-1" />
              <div>
                <p className="font-medium text-amber-800">Welcome, {managerName}</p>
                <p className="text-sm text-amber-700">You can view, accept, or decline pending stock transfers sent to your location ({selectedLocation}).</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Pending Transfers
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Processed Transfers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-0">
              <PendingTransfers location={selectedLocation} />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-500 mb-2">To view your transfer history, click the "View Records" button.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setViewRecords(true)} 
                  className="flex items-center gap-1 mx-auto"
                >
                  <Eye className="h-4 w-4" /> View Complete Transfer History
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Inbox className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-800">About Stock Transfers</p>
            <p className="text-sm text-blue-700 mt-1">
              Stock transfers from other locations will appear automatically when they are sent to your location.
              You can accept or decline each transfer based on your inventory needs and space availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivePartnerStock;
