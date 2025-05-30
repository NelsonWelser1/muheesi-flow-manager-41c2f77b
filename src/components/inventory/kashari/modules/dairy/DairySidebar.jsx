
import React from 'react';
import { Beef, LineChart, Droplet, BarChart2, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DairySidebar = ({
  activeSection,
  setActiveSection,
  isCollapsed
}) => {
  const handleMenuItemClick = sectionId => {
    setActiveSection(sectionId);
    // Store the active section in localStorage for persistence
    localStorage.setItem('dairyActiveSection', sectionId);
  };

  // Organize menu items into separate entities/categories
  const menuCategories = [
    {
      id: 'livestock',
      title: 'Livestock',
      items: [
        {
          id: 'cattleInventory',
          label: 'Cattle Inventory',
          icon: <Beef className="h-5 w-5" />
        },
        {
          id: 'healthRecords',
          label: 'Health Records',
          icon: <Stethoscope className="h-5 w-5" />
        },
        {
          id: 'growthMetrics',
          label: 'Growth Metrics',
          icon: <LineChart className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'production',
      title: 'Production',
      items: [
        {
          id: 'milkProduction',
          label: 'Milk Production',
          icon: <Droplet className="h-5 w-5" />
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <BarChart2 className="h-5 w-5" />
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-gray-50 border-r p-3 px-0 py-[30px]">
      <div className="space-y-4">
        {menuCategories.map(category => (
          <div key={category.id} className="space-y-2">
            {/* Display category title if not collapsed */}
            {!isCollapsed && (
              <h4 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-1">
                {category.title}
              </h4>
            )}
            
            {/* Display items in this category */}
            {category.items.map(item => (
              <div 
                key={item.id} 
                className={`menu-item-wrapper menu-item-${item.id}`}
                data-active={activeSection === item.id ? "true" : "false"}
              >
                <Button 
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  onClick={() => handleMenuItemClick(item.id)} 
                  className={cn(
                    activeSection === item.id && "bg-gray-100",
                    "w-full justify-start"
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DairySidebar;
