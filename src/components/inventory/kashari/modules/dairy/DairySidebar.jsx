
import React, { useState } from 'react';
import { 
  Beef, 
  Droplet, 
  LineChart, 
  ChevronDown, 
  ChevronRight, 
  Stethoscope, 
  Scale, 
  TagIcon, 
  Factory, 
  Truck, 
  Users,
  BarChart2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const DairySidebar = ({
  activeSection,
  setActiveSection,
  activeTab,
  setActiveTab,
  isCollapsed = false
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

  return (
    <Sidebar className={cn("transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
      <SidebarContent>
        {!isCollapsed && (
          <div className="px-4 py-3 border-b">
            <h3 className="text-xl font-bold text-gray-700">Dairy Management</h3>
          </div>
        )}
        
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Main Sections</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Herd Management Section */}
              <SidebarMenuItem>
                <Collapsible 
                  open={expandedSections.herdManagement && !isCollapsed} 
                  onOpenChange={() => !isCollapsed && toggleSection('herdManagement')}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full flex items-center justify-between py-2", 
                        activeSection === 'herdManagement' && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        <Beef className={cn("text-orange-500", isCollapsed ? "mx-auto" : "mr-2")} />
                        {!isCollapsed && <span>Herd Management</span>}
                      </div>
                      {!isCollapsed && (expandedSections.herdManagement ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="ml-7 space-y-1 border-l-2 border-gray-200 pl-2">
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'herdManagement' && activeTab === 'inventory' && "bg-orange-50 text-orange-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('herdManagement', 'inventory')}
                    >
                      <TagIcon className="h-4 w-4 mr-2" />
                      <span>Cattle Inventory</span>
                    </SidebarMenuButton>
                    
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'herdManagement' && activeTab === 'health' && "bg-purple-50 text-purple-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('herdManagement', 'health')}
                    >
                      <Stethoscope className="h-4 w-4 mr-2" />
                      <span>Health Records</span>
                    </SidebarMenuButton>
                    
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'herdManagement' && activeTab === 'growth' && "bg-blue-50 text-blue-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('herdManagement', 'growth')}
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      <span>Growth Metrics</span>
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              
              {/* Milk Production Section */}
              <SidebarMenuItem>
                <Collapsible 
                  open={expandedSections.milkProduction && !isCollapsed} 
                  onOpenChange={() => !isCollapsed && toggleSection('milkProduction')}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full flex items-center justify-between py-2", 
                        activeSection === 'milkProduction' && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        <Droplet className={cn("text-blue-500", isCollapsed ? "mx-auto" : "mr-2")} />
                        {!isCollapsed && <span>Milk Production</span>}
                      </div>
                      {!isCollapsed && (expandedSections.milkProduction ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="ml-7 space-y-1 border-l-2 border-gray-200 pl-2">
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'milkProduction' && activeTab === 'quality' && "bg-blue-50 text-blue-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('milkProduction', 'quality')}
                    >
                      Record Milk Production
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
              
              {/* Analytics Section */}
              <SidebarMenuItem>
                <Collapsible 
                  open={expandedSections.analytics && !isCollapsed} 
                  onOpenChange={() => !isCollapsed && toggleSection('analytics')}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full flex items-center justify-between py-2", 
                        activeSection === 'analytics' && "bg-gray-100"
                      )}
                    >
                      <div className="flex items-center">
                        <BarChart2 className={cn("text-green-500", isCollapsed ? "mx-auto" : "mr-2")} />
                        {!isCollapsed && <span>Analytics</span>}
                      </div>
                      {!isCollapsed && (expandedSections.analytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="ml-7 space-y-1 border-l-2 border-gray-200 pl-2">
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'analytics' && activeTab === 'production' && "bg-green-50 text-green-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('analytics', 'production')}
                    >
                      Production Summary
                    </SidebarMenuButton>
                    
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'analytics' && activeTab === 'financial' && "bg-green-50 text-green-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('analytics', 'financial')}
                    >
                      Financial Reports
                    </SidebarMenuButton>
                    
                    <SidebarMenuButton
                      className={cn(
                        "justify-start py-1.5 px-2 text-sm",
                        activeSection === 'analytics' && activeTab === 'trends' && "bg-green-50 text-green-600 font-medium"
                      )}
                      onClick={() => handleSectionClick('analytics', 'trends')}
                    >
                      Historical Trends
                    </SidebarMenuButton>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Other Areas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Truck className="mr-2 h-5 w-5 text-gray-500" />
                    <span>Logistics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users className="mr-2 h-5 w-5 text-gray-500" />
                    <span>Staff Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default DairySidebar;
