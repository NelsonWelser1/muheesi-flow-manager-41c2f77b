
import React from 'react';
import SalesCategoryOption from './SalesCategoryOption';
import AccountsCategoryOption from './AccountsCategoryOption';

const CategorySelection = ({ onSelectCategory }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <SalesCategoryOption onClick={() => onSelectCategory('sales')} />
      <AccountsCategoryOption onClick={() => onSelectCategory('accounts')} />
    </div>
  );
};

export default CategorySelection;
