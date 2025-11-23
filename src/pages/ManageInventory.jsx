import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import UpdateStock from '../components/inventory/UpdateStock';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LogOut, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';


const ManageInventory = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "Loading...", role: "" });
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();

  // Fetch companies from database
  const { data: dbCompanies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('company_name');
      
      if (error) throw error;
      
      // Map database companies to component format
      return data?.map(company => ({
        name: company.company_name,
        description: company.description,
        component: getComponentName(company.company_name),
        manager: company.manager_name,
        contact: company.contact_phone,
        location: company.location
      })) || [];
    }
  });

  // Helper function to map company name to component identifier
  const getComponentName = (companyName) => {
    const mapping = {
      'Grand Berna Dairies': 'grand-berna',
      'KAJON Coffee Limited': 'kajon-coffee',
      'Kyalima Farmers Limited': 'kyalima-farmers',
      'Kashari Mixed Farm': 'kashari-mixed-farm',
      'Bukomero Dairy Farm': 'bukomero-dairy'
    };
    return mapping[companyName] || companyName.toLowerCase().replace(/\s+/g, '-');
  };

  const companies = dbCompanies || [];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) return;

      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        setCurrentUser({
          name: profile?.full_name || session.user.email || "User",
          role: roleData?.role || "Staff"
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setCurrentUser({
          name: session.user.email || "User",
          role: "Staff"
        });
      }
    };

    fetchUserProfile();
  }, [session]);
  
  const handleCompanyClick = company => {
    if (company.component === 'kashari-mixed-farm') {
      navigate('/manage-inventory/kashari-farm');
    } else if (company.component === 'bukomero-dairy') {
      navigate('/manage-inventory/bukomero-dairy');
    } else if (company.component === 'equator-export') {
      navigate('/manage-inventory/kajon-coffee', { state: { selectedInterface: 'equator' } });
    } else {
      setSelectedCompany(company);
    }
  };
  
  const handleBackToCompanies = () => {
    setSelectedCompany(null);
  };

  const handleHomeClick = () => {
    navigate('/');
  };
  
  if (selectedCompany) {
    return <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToCompanies}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
            <h1 className="text-3xl font-bold">{selectedCompany.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <div>{currentUser.name}</div>
              <div>{currentUser.role}</div>
            </div>
            <div className="text-sm text-gray-600">
              <Clock className="inline mr-2" />
              {format(new Date(), 'PPpp')}
            </div>
            <Button variant="outline" onClick={handleHomeClick}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            <UpdateStock defaultTab={selectedCompany.component} />
          </CardContent>
        </Card>
      </div>;
  }
  
  return <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Inventory</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <Clock className="inline mr-2" />
            {format(new Date(), 'PPpp')}
          </div>
          <Button variant="outline" onClick={handleHomeClick}>
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        {companies.map(company => <Card key={company.name} onClick={() => handleCompanyClick(company)} className="w-full cursor-pointer hover:shadow-lg transition-shadow bg-[#e7f5e7]">
            <CardHeader className="my-[10px] bg-[#f6f9f6] rounded-none">
              <CardTitle className="flex justify-between items-start">
                <span>{company.name}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{company.description}</p>
              {(company.manager || company.contact || company.location) && <div className="mt-2 text-sm">
                  {company.manager && <p><strong>Manager:</strong> {company.manager}</p>}
                  {company.contact && <p><strong>Contact:</strong> {company.contact}</p>}
                  {company.location && <p><strong>Location:</strong> {company.location}</p>}
                </div>}
            </CardHeader>
          </Card>)}
      </div>
    </div>;
};

export default ManageInventory;
