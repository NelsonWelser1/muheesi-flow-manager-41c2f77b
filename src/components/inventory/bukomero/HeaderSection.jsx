
import React from "react";

const HeaderSection = ({ title }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">{title}</h1>
    {/* Additional header elements (breadcrumb, actions) can be placed here */}
  </div>
);

export default HeaderSection;
