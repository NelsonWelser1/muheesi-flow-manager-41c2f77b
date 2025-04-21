
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CEOSidebar from '../components/executive/CEOSidebar';
import ManageCompaniesContent from '../components/executive/management/ManageCompanies';

const ManageCompanies = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <CEOSidebar activeTab="" onChangeTab={() => {}} />
      <div className="flex-1">
        <ManageCompaniesContent />
      </div>
    </div>
  );
};

export default ManageCompanies;
