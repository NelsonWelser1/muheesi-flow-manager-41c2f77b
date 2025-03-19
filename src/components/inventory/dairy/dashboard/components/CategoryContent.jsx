
import React from 'react';
import SalesTiles from './SalesTiles';
import AccountsTiles from './AccountsTiles';

const CategoryContent = ({ activeCategory, onBackToCategories, onSelectForm }) => {
  return (
    <>
      <button 
        onClick={onBackToCategories}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to Categories
      </button>
      
      {activeCategory === 'sales' && (
        <>
          <h2 className="text-2xl font-bold mb-4">Sales Management</h2>
          <SalesTiles onSelectForm={onSelectForm} />
        </>
      )}
      
      {activeCategory === 'accounts' && (
        <>
          <h2 className="text-2xl font-bold mb-4">Accounts Management</h2>
          <AccountsTiles onSelectForm={onSelectForm} />
        </>
      )}
    </>
  );
};

export default CategoryContent;
