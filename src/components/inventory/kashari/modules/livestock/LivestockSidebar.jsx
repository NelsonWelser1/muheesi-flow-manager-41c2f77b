
import React, { useState } from 'react';
import { 
  Beef, 
  UserPlus, 
  Stethoscope, 
  LineChart,
  ChevronDown,
  ChevronRight,
  Scale,
  Activity,
  TrendingUp
} from "lucide-react";

const LivestockSidebar = ({ activeSection, setActiveSection, activeTab, setActiveTab }) => {
  const [expandedSections, setExpandedSections] = useState({
    cattleManagement: true,
    healthRecords: false,
    growthMetrics: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionClick = (section, tab = null) => {
    setActiveSection(section);
    if (tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-64 bg-white border-r h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-6 text-gray-700">Livestock Management</h3>
        
        {/* Cattle Management Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => toggleSection('cattleManagement')}
          >
            <div className="flex items-center">
              <Beef className="mr-2 h-5 w-5 text-orange-500" />
              <span>Cattle Management</span>
            </div>
            {expandedSections.cattleManagement ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.cattleManagement && (
            <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'cattleList' ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('cattleList')}
              >
                <Beef className="inline-block mr-2 h-4 w-4" />
                Cattle List
              </button>
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'registration' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('registration')}
              >
                <UserPlus className="inline-block mr-2 h-4 w-4" />
                Registration
              </button>
            </div>
          )}
        </div>

        {/* Health Records Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => toggleSection('healthRecords')}
          >
            <div className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-purple-500" />
              <span>Health Records</span>
            </div>
            {expandedSections.healthRecords ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.healthRecords && (
            <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'vaccinations' ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('vaccinations')}
              >
                <Activity className="inline-block mr-2 h-4 w-4" />
                Vaccinations
              </button>
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'treatments' ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('treatments')}
              >
                <Stethoscope className="inline-block mr-2 h-4 w-4" />
                Treatments
              </button>
            </div>
          )}
        </div>

        {/* Growth Metrics Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => toggleSection('growthMetrics')}
          >
            <div className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-green-500" />
              <span>Growth Metrics</span>
            </div>
            {expandedSections.growthMetrics ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.growthMetrics && (
            <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'weightTracking' ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('weightTracking')}
              >
                <Scale className="inline-block mr-2 h-4 w-4" />
                Weight Tracking
              </button>
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'performance' ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('performance')}
              >
                <TrendingUp className="inline-block mr-2 h-4 w-4" />
                Performance Metrics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivestockSidebar;
