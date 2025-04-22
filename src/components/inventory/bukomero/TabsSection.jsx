
import React from "react";

// Placeholder for tabs, actual tab state/handlers can be managed in the parent and passed as props
const TabsSection = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          activeTab === tab.id
            ? "bg-primary text-white"
            : "bg-muted text-muted-foreground hover:bg-accent"
        }`}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TabsSection;
