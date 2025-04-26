
import React, { useState } from 'react';
import { 
  Beef, 
  Droplet, 
  LineChart, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  Tag,
  Stethoscope, 
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSectionClick = (section, tab = null) => {
    setActiveSection(section);
    if (tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className={cn(
      "relative bg-white border-r h-[calc(100vh-7rem)] overflow-y-auto transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full bg-white border shadow-sm"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="p-4">
        {!isCollapsed && <h3 className="text-xl font-bold mb-6 text-gray-700">Dairy Management</h3>}
        
        {/* Herd Management Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors" 
            onClick={() => !isCollapsed && toggleSection('herdManagement')}
          >
            <div className="flex items-center">
              <Beef className="mr-2 h-5 w-5 text-orange-500" />
              {!isCollapsed && <span>Herd Management</span>}
            </div>
            {!isCollapsed && (expandedSections.herdManagement ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </button>
          
          {!isCollapsed && expandedSections.herdManagement && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'herdManagement' && activeTab === 'inventory' ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('herdManagement', 'inventory')}>
                <Tag className="inline-block mr-2 h-4 w-4" />
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
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => !isCollapsed && toggleSection('milkProduction')}
          >
            <div className="flex items-center">
              <Droplet className="mr-2 h-5 w-5 text-blue-500" />
              {!isCollapsed && <span>Milk Production</span>}
            </div>
            {!isCollapsed && (expandedSections.milkProduction ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </button>
          
          {!isCollapsed && expandedSections.milkProduction && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
              <button className={`block w-full text-left p-2 text-sm rounded-md ${activeSection === 'milkProduction' && activeTab === 'quality' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`} onClick={() => handleSectionClick('milkProduction', 'quality')}>
                Record Milk Production
              </button>
            </div>}
        </div>
        
        {/* Analytics Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => !isCollapsed && toggleSection('analytics')}
          >
            <div className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-green-500" />
              {!isCollapsed && <span>Analytics</span>}
            </div>
            {!isCollapsed && (expandedSections.analytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </button>
          
          {!isCollapsed && expandedSections.analytics && <div className="ml-7 mt-2 space-y-1 border-l-2 border-gray-200 pl-2">
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
      </div>
    </div>
  );
};

export default DairySidebar;
