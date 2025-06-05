
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Building2, Users, Heart, Shield } from 'lucide-react';
import HandbookViewer from './HandbookViewer';

const companies = [
  {
    id: 'grand-berna',
    name: 'Grand Berna Dairies',
    type: 'Dairy Processing & Manufacturing',
    mission: 'To provide the highest quality dairy products while supporting local farmers and communities.',
    vision: 'To be the leading dairy company in East Africa, known for quality, sustainability, and innovation.',
    description: 'Specializing in milk processing, cheese production, and dairy distribution.'
  },
  {
    id: 'kajon-coffee',
    name: 'Kajon Coffee Exports',
    type: 'Coffee Export & Trading',
    mission: 'To connect premium Ugandan coffee with global markets while empowering local farmers.',
    vision: 'To be the premier coffee export company, recognized for quality and ethical sourcing.',
    description: 'Expert coffee sourcing, processing, and international export services.'
  },
  {
    id: 'fresheco-exports',
    name: 'Fresheco Exports',
    type: 'Fresh Produce Export',
    mission: 'To deliver the freshest, highest quality produce from farm to global markets.',
    vision: 'To be the most trusted name in fresh produce exports across Africa.',
    description: 'Fresh fruits, vegetables, and agricultural product export specialists.'
  }
];

const StaffHandbook = ({ onBack }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  if (selectedCompany) {
    return (
      <HandbookViewer 
        company={selectedCompany} 
        onBack={() => setSelectedCompany(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Handbooks</h1>
            <p className="text-gray-600">Select a company to view their staff handbook</p>
          </div>
        </div>
      </div>

      {/* Company Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card 
            key={company.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCompany(company)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {company.name}
                  </CardTitle>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    {company.type}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {company.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Staff Guide</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>Welcoming</span>
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="text-xs">
                  View Handbook
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Information Footer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">About Our Staff Handbooks</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Each company handbook is designed to provide comprehensive guidance for new and existing employees. 
                Our handbooks include employment policies, code of conduct, benefits information, and workplace procedures 
                tailored to each company's unique culture and requirements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffHandbook;
