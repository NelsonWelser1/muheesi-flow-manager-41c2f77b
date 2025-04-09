
import React from 'react';
import ComplianceButton from '../compliance/ComplianceButton';

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">KAJON Equata Coffee</h2>
      <ComplianceButton />
    </div>
  );
};

export default Header;
