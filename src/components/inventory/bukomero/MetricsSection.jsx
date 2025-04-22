
import React from "react";

// Accepts a metrics array or props, and renders the dashboard metrics/cards section
const MetricsSection = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {metrics.map((metric, idx) => (
      <div key={idx} className="bg-white p-4 rounded shadow flex flex-col gap-1 text-center">
        <span className="text-sm text-muted-foreground">{metric.label}</span>
        <span className="font-bold text-xl">{metric.value}</span>
      </div>
    ))}
  </div>
);

export default MetricsSection;
