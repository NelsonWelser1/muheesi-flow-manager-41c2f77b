
import React from 'react';
import { FileText } from "lucide-react";

const NoDeliveriesFound = ({ searchTerm, activeTab }) => {
  return (
    <div className="text-center py-8">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">No deliveries found</h3>
      <p className="text-sm text-gray-500">
        {searchTerm 
          ? "Try adjusting your search term" 
          : activeTab !== 'all' 
            ? `No ${activeTab.replace('_', ' ')} deliveries found` 
            : "Create your first delivery to see it here"}
      </p>
    </div>
  );
};

export default NoDeliveriesFound;
