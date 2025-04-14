
import React from 'react';
import { 
  Beef, 
  Stethoscope,
  Scale,
  TagIcon,
  UserPlus,
} from "lucide-react";

const LivestockSidebar = ({ activeSection, setActiveSection }) => {
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="w-64 bg-white border-r h-full overflow-y-auto">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-6 text-gray-700">Livestock Management</h3>
        
        {/* Cattle Inventory Section */}
        <div className="mb-4">
          <button 
            className={`flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors ${
              activeSection === 'cattleInventory' ? 'bg-orange-50 text-orange-600' : ''
            }`}
            onClick={() => handleSectionClick('cattleInventory')}
          >
            <Beef className="mr-2 h-5 w-5 text-orange-500" />
            <span>Cattle Inventory</span>
          </button>
        </div>

        {/* Health Records Section */}
        <div className="mb-4">
          <button 
            className={`flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors ${
              activeSection === 'healthRecords' ? 'bg-purple-50 text-purple-600' : ''
            }`}
            onClick={() => handleSectionClick('healthRecords')}
          >
            <Stethoscope className="mr-2 h-5 w-5 text-purple-500" />
            <span>Health Records</span>
          </button>
        </div>

        {/* Growth Metrics Section */}
        <div className="mb-4">
          <button 
            className={`flex items-center w-full p-2 text-left font-medium hover:bg-gray-100 rounded-md transition-colors ${
              activeSection === 'growthMetrics' ? 'bg-green-50 text-green-600' : ''
            }`}
            onClick={() => handleSectionClick('growthMetrics')}
          >
            <Scale className="mr-2 h-5 w-5 text-green-500" />
            <span>Growth Metrics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestockSidebar;
