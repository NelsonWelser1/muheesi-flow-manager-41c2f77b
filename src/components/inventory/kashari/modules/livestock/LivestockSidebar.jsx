
import React, { useState } from 'react';
import { 
  Beef, 
  UserPlus,
  Stethoscope,
  Scale,
  ChevronDown,
  ChevronRight,
  Activity,
  TagIcon,
  FileText
} from "lucide-react";

const LivestockSidebar = ({ 
  activeSection, 
  setActiveSection, 
  activeSubSection, 
  setActiveSubSection 
}) => {
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

  const handleSectionClick = (section, subSection = null) => {
    setActiveSection(section);
    setActiveSubSection(subSection);
    
    // Auto-expand the clicked section
    setExpandedSections(prev => ({
      ...prev,
      [section]: true
    }));
  };

  return (
    <div className="w-64 bg-white border-r h-full overflow-y-auto">
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
                  activeSection === 'cattleManagement' && activeSubSection === 'list' 
                    ? 'bg-orange-50 text-orange-600 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('cattleManagement', 'list')}
              >
                <TagIcon className="inline-block mr-2 h-4 w-4" />
                Cattle List
              </button>
              <button 
                className={`block w-full text-left p-2 text-sm rounded-md ${
                  activeSection === 'cattleManagement' && activeSubSection === 'registration' 
                    ? 'bg-orange-50 text-orange-600 font-medium' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSectionClick('cattleManagement', 'registration')}
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
            className={`flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors ${
              activeSection === 'healthRecords' ? 'bg-purple-50' : ''
            }`}
            onClick={() => handleSectionClick('healthRecords')}
          >
            <div className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-purple-500" />
              <span>Health Records</span>
            </div>
          </button>
        </div>

        {/* Growth Metrics Section */}
        <div className="mb-4">
          <button 
            className={`flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors ${
              activeSection === 'growthMetrics' ? 'bg-green-50' : ''
            }`}
            onClick={() => handleSectionClick('growthMetrics')}
          >
            <div className="flex items-center">
              <Scale className="mr-2 h-5 w-5 text-green-500" />
              <span>Growth Metrics</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestockSidebar;
