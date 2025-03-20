
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import RecruitmentExportActions from '../RecruitmentExportActions';

const RecordsHeader = ({ records }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Recruitment Records</CardTitle>
      <RecruitmentExportActions 
        records={records} 
        fileName="recruitment_records" 
      />
    </CardHeader>
  );
};

export default RecordsHeader;
