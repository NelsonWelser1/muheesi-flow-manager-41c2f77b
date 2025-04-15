import React, { useState } from 'react';
import { Beef, Droplet, LineChart, ChevronDown, ChevronRight, Stethoscope, Scale, TagIcon, Factory, Truck, Users } from "lucide-react";
const DairySidebar = ({
  activeSection,
  setActiveSection,
  activeTab,
  setActiveTab
}) => {
  const [expandedSections, setExpandedSections] = useState({
    herdManagement: true,
    milkProduction: false,
    analytics: false
  });
  const toggleSection = section => {
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
  return <div className="w-64 bg-white border-r h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-6 text-gray-700">Dairy Management</h3>
        
        {/* Herd Management Section */}
        <div className="mb-4">
          <button className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors" onClick={() => toggleSection('herdManagement')}>
            <div className="flex items-center">
              <Beef className="mr-2 h-5 w-5 text-orange-500" />
              <span>Herd Management</span>
            </div>
            {expandedSections.herdManagement ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.herdManagement && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'herdManagement' && activeTab === 'inventory' ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('herdManagement', 'inventory')}>
                <TagIcon className="inline-block mr-2 h-4 w-4" />
                Cattle Inventory
              </button>
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'herdManagement' && activeTab === 'health' ? 'bg-purple-50 text-purple-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('herdManagement', 'health')}>
                <Stethoscope className="inline-block mr-2 h-4 w-4" />
                Health Records
              </button>
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'herdManagement' && activeTab === 'growth' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('herdManagement', 'growth')}>
                <Scale className="inline-block mr-2 h-4 w-4" />
                Growth Metrics
              </button>
            </div>}
        </div>
        
        {/* Milk Production Section */}
        <div className="mb-4">
          <button className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors" onClick={() => toggleSection('milkProduction')}>
            <div className="flex items-center">
              <Droplet className="mr-2 h-5 w-5 text-blue-500" />
              <span>Milk Production</span>
            </div>
            {expandedSections.milkProduction ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.milkProduction && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'milkProduction' && activeTab === 'daily' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('milkProduction', 'daily')}>
                Daily Records
              </button>
              
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'milkProduction' && activeTab === 'quality' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('milkProduction', 'quality')}>
                Quality Control
              </button>
            </div>}
        </div>
        
        {/* Analytics Section */}
        <div className="mb-4">
          <button className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors" onClick={() => toggleSection('analytics')}>
            <div className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-green-500" />
              <span>Analytics</span>
            </div>
            {expandedSections.analytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          
          {expandedSections.analytics && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'analytics' && activeTab === 'production' ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('analytics', 'production')}>
                Production Summary
              </button>
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'analytics' && activeTab === 'financial' ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('analytics', 'financial')}>
                Financial Reports
              </button>
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'analytics' && activeTab === 'trends' ? 'bg-green-50 text-green-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('analytics', 'trends')}>
                Historical Trends
              </button>
            </div>}
        </div>

        {/* Other Management Areas */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Other Areas</h4>
          <button className="flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors">
            <Factory className="mr-2 h-5 w-5 text-gray-500" />
            <span>Dairy Factory</span>
          </button>
          <button className="flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors">
            <Truck className="mr-2 h-5 w-5 text-gray-500" />
            <span>Logistics</span>
          </button>
          <button className="flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors">
            <Users className="mr-2 h-5 w-5 text-gray-500" />
            <span>Staff Management</span>
          </button>
        </div>
      </div>
    </div>;
};
export default DairySidebar;